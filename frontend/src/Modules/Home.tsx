import dp from "../assets/aidemo.mp4";
import { FaGlobe, FaMagic, FaVideo } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white py-20 px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
            AI-Powered Video Creation in Seconds!
          </h1>
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            Turn any webpage or article (News) into an <strong>engaging AI-generated video </strong>  
            with just one click. No technical skills required!
          </p>

          {/* Call to Action Button */}
          <a
            href="/login"
            className="bg-cyan-500 text-black py-3 px-8 rounded-full text-lg font-bold shadow-lg transition-all transform hover:bg-cyan-700 hover:scale-105 animate-pulse"
          >
            Get Started for Free →
          </a>
        </div>

        {/* Right Content - Video Preview */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0 relative">
          <video 
            src={dp} 
            className="w-full h-auto rounded-lg shadow-lg" 
            autoPlay 
            loop 
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <h2 className="text-cyan-400 text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaGlobe className="text-gray-500 text-5xl mb-4" />
            <h3 className="text-cyan-400 text-xl font-semibold mb-2">Enter URL</h3>
            <p className="text-gray-300">Paste a website link to start the AI-driven video creation process.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaMagic className="text-gray-500 text-5xl mb-4" />
            <h3 className="text-cyan-400 text-xl font-semibold mb-2">AI Generates Story</h3>
            <p className="text-gray-300">Our AI extracts key content and generates a script with visuals.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaVideo className="text-gray-500 text-5xl mb-4" />
            <h3 className="text-cyan-400 text-xl font-semibold mb-2">Download Video</h3>
            <p className="text-gray-300">Download your AI-generated video and share it instantly.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-cyan-400 text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">AI-Generated Videos</h3>
            <p className="text-gray-300 mb-4">
              Our AI automatically creates professional-quality videos from URLs.
            </p>
            <p className="text-gray-400">
              Simply enter a link, and our system extracts key information, generating a well-structured video with voiceovers and subtitles.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">Simple Interface</h3>
            <p className="text-gray-300 mb-4">
              No technical knowledge needed! Our intuitive UI ensures a smooth experience.
            </p>
            <p className="text-gray-400">
              With a single click, you can turn an article into a stunning video.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">Fast Processing</h3>
            <p className="text-gray-300 mb-4">
              AI-powered rendering ensures your videos are ready in minutes.
            </p>
            <p className="text-gray-400">
              Unlike traditional methods, our system optimizes processing, delivering HD videos with AI-synced narration faster than ever.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-gray-400 text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Free Plan */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">Free</h3>
            <p className="text-gray-300 mb-4">Basic AI video generation with limited features.</p>
            <p className="text-gray-400 mb-4">✔️ 3 free videos per day</p>
            <button className="bg-cyan-500 text-black py-2 px-6 rounded-full text-lg font-bold transition-all hover:bg-cyan-700">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg text-center border border-cyan-500">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">Pro</h3>
            <p className="text-gray-300 mb-4">Unlock full AI-powered video creation.</p>
            <p className="text-gray-400 mb-4">✔️ 50 videos per day</p>
            <button className="bg-cyan-500 text-black py-2 px-6 rounded-full text-lg font-bold transition-all hover:bg-cyan-700">
              Upgrade Now
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-transparent border border-gray-700 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">Enterprise</h3>
            <p className="text-gray-300 mb-4">Custom AI solutions for businesses.</p>
            <p className="text-gray-300 mb-4">✔️ unlimited videos</p>
            <button className="bg-cyan-500 text-black py-2 px-6 rounded-full text-lg font-bold transition-all hover:bg-cyan-700">
              Contact Us
            </button>
          </div>

        </div>
      </section>

      
      {/* Footer */}
      <footer className="bg-gray-900 p-4 flex justify-between items-center">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            
            <div>
              <h3 className="font-bold mb-2">ArticVidz</h3>
              <ul className="space-y-1">
              <li><a href="/" className="text-gray-200 hover:underline">Home</a></li>
                <li><a href="/urlvid" className="text-gray-200 hover:underline">Demos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Support</h3>
              <ul className="space-y-1">
                <li><a href="mailto:dhanalaptop@gmail.com" className="text-gray-200 hover:underline">Contact us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Social</h3>
              <ul className="space-y-1">
                <li><a href="https://github.com/yourgithubrepo" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:underline">Github</a></li>
              </ul>
            </div>

          </div>

          <div className="mt-6 text-gray-300">
            © 2025 ArticVidz, Inc. All rights reserved.
          </div>
        </div>
      </footer>


    </div>
  );
};

export default Home;
