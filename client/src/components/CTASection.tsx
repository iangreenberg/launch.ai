import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function CTASection() {
  const benefits = [
    "Personalized solution recommendation",
    "ROI analysis for your business",
    "Implementation timeline and roadmap"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-gray-600 mb-6">Schedule a free consultation with our AI experts to explore how our solutions can address your specific business challenges.</p>
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cyan-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
              <motion.a 
                href="#contact" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-cyan-600 text-white font-semibold rounded-md hover:opacity-90 transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Your Free Consultation
              </motion.a>
            </div>
            <div className="h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&auto=format" 
                className="w-full h-full object-cover" 
                alt="Business team working with AI technology" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
