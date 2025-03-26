import { motion } from "framer-motion";
import { FaGoogle, FaMicrosoft, FaAmazon, FaSlack, FaSalesforce } from "react-icons/fa";
import { SiAdobe } from "react-icons/si";

export default function TrustedBySection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const companies = [
    { icon: FaGoogle, name: "Google" },
    { icon: FaMicrosoft, name: "Microsoft" },
    { icon: FaAmazon, name: "Amazon" },
    { icon: FaSlack, name: "Slack" },
    { icon: FaSalesforce, name: "Salesforce" },
    { icon: SiAdobe, name: "Adobe" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-gray-600 font-medium mb-8">Trusted by innovative companies worldwide</h2>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {companies.map((company, index) => (
            <motion.div 
              key={index}
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300"
              variants={item}
            >
              <company.icon className="h-8 w-auto" aria-label={company.name} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
