import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CaseStudySection() {
  const caseStudies = [
    {
      title: "Global Retail Chain",
      description: "Implemented our AI-powered analytics to optimize inventory and increase sales by 32% in just six months.",
      stat: "32%",
      statDescription: "Sales Increase",
      imageUrl: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Retail AI implementation"
    },
    {
      title: "Financial Services Firm",
      description: "Reduced customer service response time by 87% while improving satisfaction scores through our conversational AI.",
      stat: "87%",
      statDescription: "Faster Response",
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Financial services AI implementation"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">See how our clients have transformed their businesses with Launch.ai solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {caseStudies.map((study, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">{study.title}</h3>
                  <p className="text-gray-600 mb-4">{study.description}</p>
                  <div className="flex items-center">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent mr-2">{study.stat}</span>
                    <span className="text-gray-600">{study.statDescription}</span>
                  </div>
                  <a href="#contact" className="text-primary font-medium hover:text-cyan-600 transition duration-300 mt-4 inline-flex items-center">
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="h-64 md:h-auto">
                  <img 
                    src={study.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt={study.imageAlt} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
