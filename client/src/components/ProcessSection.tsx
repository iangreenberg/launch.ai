import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ProcessSection() {
  const processSteps = [
    {
      number: 1,
      title: "Discovery & Assessment",
      description: "We start by understanding your business objectives, challenges, and current capabilities to identify the right AI solutions for your needs.",
      checkpoints: [
        "Business objectives analysis",
        "Technology infrastructure assessment",
        "Data readiness evaluation"
      ]
    },
    {
      number: 2,
      title: "Strategy & Solution Design",
      description: "Our team develops a comprehensive AI strategy and solution architecture tailored to your specific requirements.",
      checkpoints: [
        "Custom solution design",
        "Technology selection",
        "Implementation roadmap"
      ]
    },
    {
      number: 3,
      title: "Development & Implementation",
      description: "We build and deploy your AI solution using agile methodologies to ensure quality and timely delivery.",
      checkpoints: [
        "Iterative development",
        "Integration with existing systems",
        "Testing and quality assurance"
      ]
    },
    {
      number: 4,
      title: "Training & Continuous Improvement",
      description: "We provide comprehensive training and ongoing support to maximize the value of your AI investment.",
      checkpoints: [
        "User training and documentation",
        "Performance monitoring",
        "Continuous optimization"
      ]
    }
  ];

  return (
    <section id="process" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Proven Process</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">We follow a systematic approach to ensure your AI implementation delivers measurable results.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {processSteps.map((step, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row mb-12 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="md:w-1/4 flex flex-col items-center md:items-start mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-cyan-600 flex items-center justify-center text-white text-xl font-bold mb-2">
                  {step.number}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-200 hidden md:block mt-2"></div>
                )}
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="text-gray-600 space-y-2">
                  {step.checkpoints.map((checkpoint, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-cyan-600 mt-1 mr-2 flex-shrink-0" />
                      <span>{checkpoint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
