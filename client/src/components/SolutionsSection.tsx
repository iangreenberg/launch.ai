import { motion } from "framer-motion";
import { ArrowRight, Bot, Database, AreaChart, MessageSquare } from "lucide-react";

export default function SolutionsSection() {
  const serviceSections = [
    {
      title: "Your Trusted AI Partner, Driving Your Continued Success",
      subtitle: "Traditional Marketing Isn't Built for the Future",
      description: "Marketing campaigns are evolving rapidly, and traditional approaches can no longer keep up. Rising costs, fragmented tools, and outdated strategies leave marketing teams struggling to achieve results. Without AI, your campaigns are at risk of falling behind in a competitive marketplace.",
      imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&auto=format",
      imageAlt: "Marketing professional using AI",
      position: "right"
    },
    {
      title: "We Bring AI to Your Marketing and Customer Service",
      subtitle: "Cutting-Edge AI Solutions for Modern Businesses",
      description: "Launch.ai helps marketing and customer service teams move from traditional digital strategies to AI-driven campaigns. Using cutting-edge tools like Data Rooms, Custom GPTs, and AI Chatbots, we enable you to run smarter, more efficient campaigns with better insights and lower costs.",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format",
      imageAlt: "AI customer service solutions",
      position: "left"
    }
  ];
  
  const solutionsData = [
    {
      title: "Data Rooms",
      description: "A centralized hub that organizes and powers AI with high-quality data for accurate insights and optimized performance.",
      icon: Database,
      iconBg: "bg-blue-100"
    },
    {
      title: "Custom GPTs",
      description: "AI-powered virtual strategists that automate marketing, generate data-driven content, and optimize campaigns in real-time.",
      icon: Bot,
      iconBg: "bg-gray-100"
    },
    {
      title: "AI Chatbots",
      description: "Automate customer interactions with intelligent, always-on chat support tailored to your business.",
      icon: MessageSquare,
      iconBg: "bg-green-100"
    },
    {
      title: "AI Consulting",
      description: "Expert guidance to integrate AI into your business, from strategy to custom AI solutions that drive growth and efficiency.",
      icon: AreaChart,
      iconBg: "bg-orange-100"
    }
  ];

  return (
    <section id="solutions" className="py-20">
      {/* Partner sections with alternating image placement */}
      {serviceSections.map((section, index) => (
        <div key={index} className="mb-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                {section.title}
              </motion.h2>
            </div>
            
            <div className={`flex flex-col ${section.position === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 mt-12`}>
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: section.position === 'left' ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-4">{section.subtitle}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {section.description}
                </p>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`relative ${section.position === 'left' ? 'lg:mr-12' : 'lg:ml-12'}`}>
                  <div className={`absolute inset-0 ${section.position === 'left' ? '-left-6 -bottom-6' : '-right-6 -bottom-6'} bg-orange-200 rounded-lg`}></div>
                  <img 
                    src={section.imageUrl} 
                    alt={section.imageAlt}
                    className="relative z-10 rounded-lg shadow-lg w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Services grid section */}
      <div className="container mx-auto px-6 mt-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg uppercase tracking-wider text-gray-500 mb-2">OUR SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Solutions Built for Smarter Business Growth</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              From AI chatbots to intelligent data rooms and marketing automation, our AI-driven tools help you streamline operations, enhance customer engagement, and drive results.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutionsData.map((solution, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`mb-6 p-4 rounded-lg ${solution.iconBg}`}>
                <solution.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
              <p className="text-gray-600 mb-4">{solution.description}</p>
              <motion.a 
                href="#contact" 
                className="mt-auto inline-block px-6 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary/90 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LEARN MORE
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
