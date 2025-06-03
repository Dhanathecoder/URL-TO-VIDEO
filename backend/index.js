import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { fileURLToPath } from "url";

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use('/stories', express.static(path.join(__dirname, 'stories')));

// Mock Database (Replace with actual database like MongoDB)
const users = [];


// Register Route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Save user
  users.push({ username, email, password });
  console.log("User registered:", { username, email });

  res.status(201).json({ message: "Registration successful", username });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  console.log("User logged in:", user.username);
  res.status(200).json({ message: "Login successful", username: user.username });
});


// Function to generate an image using ClipDrop API
async function generateImage(queryText, imagePath) {
  try {
    console.log("Generating AI-stylized image with query:", queryText);

    const form = new FormData();
    form.append("prompt", queryText);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: form,
    });

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log("AI-stylized image saved at:", imagePath);
  } catch (error) {
    console.error("Error in generateImage:", error.message);
    throw error;
  }
}

// Function to generate speech using Voice RSS API
async function generateSpeech(text, filePath, language = "en-us") {
  try {
    const response = await axios.get("https://api.voicerss.org/", {
      params: {
        key: process.env.VOICERSS_API_KEY,
        src: text,
        hl: language, // Language code (default to 'en-us' for English)
        v: "Linda", // Voice name (change based on preference)
        r: 0, // Speed (range: -10 to 10)
        c: "MP3", // Audio format
        f: "44khz_16bit_stereo", // Audio quality
      },
      responseType: "arraybuffer", // Expect audio response
    });

    if (response.data) {
      fs.writeFileSync(filePath, response.data);
      console.log(`Audio saved at ${filePath}`);
    } else {
      throw new Error("Failed to generate speech");
    }
  } catch (error) {
    console.error("Error in generateSpeech:", error.message);
    throw error;
  }
}

// Function to split text into chunks, ensuring it's limited to a maximum of 3 parts
function splitByWordsLimited(text, totalWordLimit, maxParts) {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
  const chunks = [];
  let currentChunk = [];
  const maxWordsPerPart = Math.ceil(totalWordLimit / maxParts);
  let totalWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);

    if (totalWords + sentenceWords.length > totalWordLimit) break;

    if (currentChunk.length + sentenceWords.length <= maxWordsPerPart) {
      currentChunk = currentChunk.concat(sentenceWords);
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
        totalWords += currentChunk.length;
      }
      currentChunk = sentenceWords;
    }
  }

  if (currentChunk.length > 0 && totalWords + currentChunk.length <= totalWordLimit) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks.slice(0, maxParts);
}

// Video Creation
async function createVideosAndMerge(dir) {
  const videoOutputs = Array(3).fill(""); // Predefine array to maintain order

  const tasks = Array.from({ length: 3 }, (_, i) => {
    const index = i + 1;
    const imagePath = path.join(dir, `image-${index}.png`);
    const audioPath = path.join(dir, `audio-${index}.mp3`);
    const outputPath = path.join(dir, `output-${index}.mp4`);
  
    return new Promise((resolve, reject) => {
      exec(`ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv=p=0`, (err, stdout) => {
        if (err) return reject(`Error getting duration: ${err.message}`);
        const duration = parseFloat(stdout.trim()).toFixed(2);
  
        const cmd = `ffmpeg -loop 1 -i ${imagePath} -i ${audioPath} -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${duration} -movflags +faststart ${outputPath}`;
        exec(cmd, (error) => {
          if (error) return reject(`Error creating video ${index}: ${error.message}`);
  
          videoOutputs[index - 1] = `file 'output-${index}.mp4'`; // Maintain order
          resolve();
        });
      });
    });
  });
  

  try {
    await Promise.all(tasks);

    // Merge videos after all tasks complete
    await mergeVideos(dir, videoOutputs);
  } catch (error) {
    console.error("Error in video creation:", error);
  }
}


// GET /create-story Route
app.get("/create-story", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL query parameter is required" });
  }

  const storyId = uuidv4(); // Generate a unique ID
  const folderPath = `./stories/${storyId}`;
  fs.mkdirSync(folderPath, { recursive: true });

  const options = {
    method: "GET",
    url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize",
    params: { url: url, summarize: "true", summarize_language: "auto" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const summary = response.data.summary;
    if (!summary) {
      return res.status(400).json({ error: "Summary not found in the API response" });
    }

    const parts = splitByWordsLimited(summary, 150, 3);

    for (const [index, part] of parts.entries()) {
      fs.writeFileSync(`${folderPath}/story-${index + 1}.txt`, part);

      await generateImage(part.split(".")[0], `${folderPath}/image-${index + 1}.png`);
      await generateSpeech(part, `${folderPath}/audio-${index + 1}.mp3`);
    }

    // Call createVideosAndMerge after generating images & audio
    await createVideosAndMerge(folderPath);

    res.status(200).json({ message: "Story created", id: storyId, parts });

  } catch (error) {
    console.error("Error in /create-story:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create story" });
  }
});


app.get("/build-video", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  const dir = `./stories/${id}`;
  const finalVideoPath = path.join(dir, "final.mp4");

  if (!fs.existsSync(dir)) {
    return res.status(404).json({ error: "Story not found" });
  }

  // Check if final.mp4 already exists
  if (!fs.existsSync(finalVideoPath)) {
    return res.status(404).json({ error: "Video merging not completed yet" });
  }

  res.json({ videoUrl: `/stories/${id}/final.mp4` });
});

function mergeVideos(dir, videoOutputs) {
  return new Promise((resolve, reject) => {
    const fileList = path.join(dir, "fileList.txt");
    fs.writeFileSync(fileList, videoOutputs.join("\n") + "\n");
    const finalOutputPath = path.join(dir, "final.mp4");

    exec(`ffmpeg -f concat -safe 0 -i ${fileList} -c copy ${finalOutputPath}`, (error) => {
      if (error) {
        console.error("Error merging videos:", error);
        reject(error);
      } else {
        console.log("Final video merged successfully at", finalOutputPath);
        resolve();
      }
    });
  });
}



app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
