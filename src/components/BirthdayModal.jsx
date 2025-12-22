import { motion } from "framer-motion";

export default function BirthdayModal({ name, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-yellow-400 text-xl"
            initial={{
              top: "-10%",
              left: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              top: "110%",
              opacity: 1,
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-3xl p-8 max-w-md text-center shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold mb-3">
          🎉 عيد ميلاد سعيد 🎉
        </h1>

        <p className="text-xl font-bold mb-4">
          {name} 💛
        </p>

        <p className="mb-6">
          كل عام وأنتِ متألقة وناجحة ✨  
          نتمنى لكِ عامًا مليئًا بالتفوق والإنجاز 🎓
        </p>

        {/* Images */}
        <div className="flex justify-center gap-4 text-4xl mb-6">
          🎂 🕯️ 🎁 🎈
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-black text-yellow-400 rounded-full font-bold hover:bg-gray-900 transition"
        >
          شكرًا 🎉
        </button>
      </motion.div>
    </div>
  );
}
