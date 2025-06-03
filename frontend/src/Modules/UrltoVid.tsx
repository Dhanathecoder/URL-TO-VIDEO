import axios from "axios";
import { FormEvent, useEffect, useState, useRef } from "react";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
  const [url, setUrl] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [samples, setSamples] = useState<string[]>([]);
  const [activeSampleIndex, setActiveSampleIndex] = useState<null | number>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoCount, setVideoCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/samples')
      .then(response => setSamples(response.data))
      .catch(error => console.error("Error fetching samples:", error));
  }, []);

  useEffect(() => {
    if (samples.length) {
      randomSample();
      intervalRef.current = setInterval(() => {
        randomSample();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [samples]);

  function randomSample() {
    const random = randomIntFromInterval(0, samples.length - 1);
    setActiveSampleIndex(random);
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    
    if (videoCount >= 3) {
      setLoadingMessage("Whoa there! You've hit the 3-video limit. Come back tomorrow or bribe the AI with cookies! 🍪");
      setTimeout(() => setLoadingMessage(""), 3000);
      return;
    }

    setLoadingMessage('Generating assets...');

    try {
      const assetsResponse = await axios.get(
        `http://localhost:8080/create-story?url=${encodeURIComponent(url)}`
      );

      const id = typeof assetsResponse.data === 'string' ? assetsResponse.data : assetsResponse.data.id;
      if (!id) throw new Error("Invalid ID received from /create-story");

      setLoadingMessage('Preparing your video...');
      await axios.get(`http://localhost:8080/build-video?id=${encodeURIComponent(id)}`);

      const videoPath = `http://localhost:8080/stories/${id}/final.mp4`;
      setVideoUrl(videoPath);
      setLoadingMessage('');
      setVideoCount(prevCount => prevCount + 1);
    } catch (error) {
      setLoadingMessage('Error occurred while generating video.Try again later.');
      console.error(error);
    }
  }

  return (
    <>
      {loadingMessage && (
        <div className="fixed inset-0 z-20 bg-black/90 flex justify-center items-center">
          <p className="text-4xl text-center">{loadingMessage}</p>
        </div>
      )}
      <main className="max-w-4xl mx-auto flex px-8">
        <div className="p-8">
          <h1 className="text-5xl font-bold uppercase mb-8">
            <span className="text-5xl">URL to Video</span>
            <br />
            <span className="text-3xl bg-gradient-to-br from-emerald-300 from-30% to-sky-300 bg-clip-text text-transparent">
              with power of AI
            </span>
          </h1>
          <form onSubmit={handleSubmit} className="grid gap-2">
            <input
              className="border-2 rounded-full bg-transparent text-white px-8 p-2 grow"
              value={url}
              onChange={ev => setUrl(ev.target.value)}
              type="url"
              placeholder="https://..."
            />
            <button className="bg-emerald-500 text-white px-8 p-2 rounded-full uppercase" type="submit">
              Create&nbsp;video
            </button>
          </form>
        </div>
        <div className="p-8">
          {videoUrl ? (
            <video controls autoPlay playsInline muted={false} className="w-[312px] h-[312px] rounded-lg" src={videoUrl}></video>
          ) : (
            <div className="font-bold text-xl text-gray-900 text-center bg-gray-200 w-[312px] h-[312px]">Video Here</div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
