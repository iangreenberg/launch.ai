import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-br from-pink-100 via-orange-50 to-cyan-100">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ borderRadius: '100% 100% 0 0' }}></div>
      
      <div className="container mx-auto px-6 pt-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-6">
          <motion.div 
            className="lg:w-1/2 pt-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Revolutionize Your Marketing and Customer Service with AI
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-xl">
              We help companies shift from traditional strategies to AI-driven marketing campaigns that work today—and prepare you for tomorrow.
            </p>
            <motion.a 
              href="#contact" 
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              LEARN MORE
            </motion.a>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              {/* Circular background */}
              <div className="absolute -top-10 -right-10 w-[500px] h-[500px] bg-green-400/80 rounded-full"></div>
              
              {/* Person image */}
              <img 
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop" 
                alt="Business professional with tablet" 
                className="relative z-10 rounded-full h-[450px] w-[450px] object-cover object-center shadow-lg"
              />
              
              {/* Floating elements */}
              <motion.div 
                className="absolute top-1/4 -left-8 bg-white p-2 rounded-lg shadow-lg z-20"
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/1048/1048966.png" alt="Chat icon" className="w-10 h-10" />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/3 -right-6 bg-white p-2 rounded-lg shadow-lg z-20"
                animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/1170/1170611.png" alt="Analytics icon" className="w-10 h-10" />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-1/4 -left-10 bg-white p-2 rounded-lg shadow-lg z-20"
                animate={{ y: [0, 8, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" alt="Robot icon" className="w-10 h-10" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
