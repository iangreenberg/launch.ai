import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What types of businesses benefit most from AI solutions?",
      answer: "Businesses across all industries can benefit from AI solutions. Organizations with large amounts of data, complex operations, customer service needs, or manual repetitive tasks see particularly significant ROI. Our solutions are scalable and can be tailored to businesses of any size, from startups to enterprise organizations."
    },
    {
      question: "How long does it take to implement an AI solution?",
      answer: "Implementation timelines vary based on the complexity of the solution and your organization's readiness. Simple solutions can be deployed in as little as 4-6 weeks, while more complex enterprise implementations may take 3-6 months. During our initial assessment, we'll provide a detailed timeline specific to your project."
    },
    {
      question: "What kind of ROI can we expect from AI implementation?",
      answer: "ROI varies by solution and industry, but our clients typically see returns within 6-12 months of implementation. Common results include 25-40% reduction in operational costs, 15-30% increase in productivity, and 20-35% improvement in customer satisfaction metrics. We work with you to establish clear KPIs and measure results throughout the implementation."
    },
    {
      question: "How do you ensure data security and privacy?",
      answer: "Data security and privacy are our top priorities. We implement industry-leading security protocols including end-to-end encryption, secure access controls, and regular security audits. Our solutions comply with relevant regulations such as GDPR, HIPAA, and CCPA. We provide detailed documentation of our security measures and can work with your IT team to ensure alignment with your internal security policies."
    },
    {
      question: "What ongoing support do you provide after implementation?",
      answer: "We offer comprehensive support packages tailored to your needs. All implementations include initial training and documentation. Our standard support includes regular performance monitoring, system updates, and technical support via phone, email, and chat. For enterprise clients, we offer dedicated support managers, quarterly business reviews, and continuous optimization services to ensure your AI solution evolves with your business."
    }
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Find answers to common questions about our AI solutions and implementation process.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="py-5 border-none">
                <AccordionTrigger className="text-xl font-semibold text-left hover:no-underline">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mt-4">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
