import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SolutionsSection() {
  const solutionsData = [
    {
      title: "AI-Powered Analytics",
      description: "Transform your data into actionable insights with advanced machine learning algorithms that identify patterns, trends, and opportunities.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Business professionals using AI technology"
    },
    {
      title: "Intelligent Automation",
      description: "Streamline operations and reduce costs with AI-driven automation solutions that handle repetitive tasks with precision and efficiency.",
      imageUrl: "https://images.unsplash.com/photo-1581091224003-d153fb8298e4?w=600&h=400&fit=crop&auto=format",
      imageAlt: "AI product launch concept"
    },
    {
      title: "Customer Experience AI",
      description: "Elevate customer satisfaction with personalized experiences powered by AI that understands preferences and anticipates needs.",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Digital marketing team meeting"
    },
    {
      title: "Predictive Intelligence",
      description: "Anticipate market changes and customer behaviors with powerful predictive models that help you stay ahead of the competition.",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9fa73e2d48f8?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Business professionals using AI technology"
    },
    {
      title: "Natural Language Processing",
      description: "Harness the power of advanced NLP to analyze documents, extract insights from conversations, and create intelligent chatbots.",
      imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop&auto=format",
      imageAlt: "AI product launch concept"
    },
    {
      title: "Custom AI Development",
      description: "Build tailored AI solutions that address your unique business challenges with our expert development team and cutting-edge technology.",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Digital marketing team meeting"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="solutions" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Solutions for Every Business Need</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our comprehensive suite of AI tools and services are designed to address your specific challenges and unlock new opportunities.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {solutionsData.map((solution, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={solution.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt={solution.imageAlt} 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <a href="#contact" className="text-primary font-medium hover:text-cyan-600 transition duration-300 flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
