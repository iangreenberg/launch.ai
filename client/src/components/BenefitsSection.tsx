import { motion } from "framer-motion";
import { 
  ChartLine, 
  Target, 
  Users, 
  Lightbulb, 
  DollarSign, 
  ArrowUpDown 
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: ChartLine,
      title: "Increased Efficiency",
      description: "Automate routine tasks and streamline processes to free up your team for higher-value work."
    },
    {
      icon: Target,
      title: "Data-Driven Decisions",
      description: "Transform raw data into actionable insights that inform better business strategies."
    },
    {
      icon: Users,
      title: "Enhanced Customer Experience",
      description: "Deliver personalized experiences that increase satisfaction and build lasting loyalty."
    },
    {
      icon: Lightbulb,
      title: "Competitive Advantage",
      description: "Stay ahead of the curve with innovative AI solutions that differentiate your business."
    },
    {
      icon: DollarSign,
      title: "Cost Reduction",
      description: "Optimize resources and reduce operational costs through intelligent automation."
    },
    {
      icon: ArrowUpDown,
      title: "Scalable Solutions",
      description: "Our AI systems grow with your business, providing consistent value as you expand."
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
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Launch.ai</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">We combine cutting-edge AI technology with deep industry expertise to deliver solutions that drive real business results.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-start"
              variants={item}
            >
              <div className="p-3 bg-cyan-600/10 rounded-lg mb-4">
                <benefit.icon className="text-cyan-600 h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
