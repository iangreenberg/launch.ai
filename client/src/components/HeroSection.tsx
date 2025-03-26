import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-cyan-600 pt-32 pb-20 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Transform Your Business with AI Solutions</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Unlock the power of artificial intelligence to drive growth, efficiency, and innovation across your organization.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a 
              href="#contact" 
              className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.a>
            <motion.a 
              href="#solutions" 
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Solutions
            </motion.a>
          </div>
        </motion.div>
      </div>
      <div className="container mx-auto px-4 mt-16">
        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold text-white mb-2">Ready to see what AI can do for you?</h3>
              <p className="text-white/80">Schedule a free consultation with our experts.</p>
            </div>
            <motion.a 
              href="#contact" 
              className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Demo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
