import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const plan = {
  name: "FREE (Because We Love You)",
  price: "$0/month (Best Deal Ever, Right?)",
  features: [
    "✔️ 3 Free Videos per Day (Binge Wisely 🤓)",
    "✔️ No Customer Support (Talk to Your Cat Instead 🐱)",
    "✔️ 100% Satisfaction Guaranteed (Unless You Expect a Lambo 🏎️)",
    "✔️ Instant VIP Access to... Well, Nothing. But You’re VIP in Our Hearts 💖",
  ],
};

export default function FunPricingPage() {
  const [showMessage, setShowMessage] = useState(false);
  const { width, height } = useWindowSize();

  const handleFreePlan = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000); // Hide message after 5 sec
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white py-12 relative mb-4 mt-[-40px]">
      <h2 className="text-4xl font-extrabold text-yellow-400 text-center mb-8">
        💸 *The Ultimate Pricing Plan* 💸  
        <span className="block text-cyan-400 text-2xl mt-2"> (*Because Free is the Best Price!*)</span>
      </h2>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
        className="border border-cyan-400 p-8 rounded-xl shadow-lg flex flex-col items-center text-center max-w-md backdrop-blur-md bg-transparent transform hover:scale-105 transition-all"
      >
        <h3 className="text-green-400 text-3xl font-bold mb-4">{plan.name}</h3>
        <p className="text-2xl font-bold text-gray-300 mb-4">{plan.price}</p>

        <ul className="mb-6 space-y-2 text-sm text-gray-200">
          {plan.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
              className="flex items-center"
            >
              ✨ {feature}
            </motion.li>
          ))}
        </ul>

        {/* Fun Button with Animations */}
        <motion.button
          onClick={handleFreePlan}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9, rotate: -3 }}
          className="bg-gradient-to-r from-pink-500 to-yellow-500 text-black px-6 py-3 rounded-full uppercase font-bold text-lg transition-all shadow-md hover:bg-yellow-700"
        >
          Claim Free Plan(Limited Time Offer...Until Forever 😆)
        </motion.button>
      </motion.div>

      {/* Confetti Effect 🎉 */}
      {showMessage && <Confetti width={width} height={height} />}

      {/* Hilarious Success Message 🎭 */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-2 bg-cyan-600 text-white rounded-lg shadow-md text-lg"
          >
            🎉 Congratulations! You Now Have **Unlimited Access** to *Absolutely Nothing New!*  
            But hey, you’re now officially a **VIP Free Plan Member!** 🤩✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
