import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Import the apiRequest function directly
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  solution: z.string().min(1, "Please select a solution"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      solution: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form submitted:", data);
      
      // Use the apiRequest function for the contact endpoint
      const response = await apiRequest('POST', '/api/contact', data);
      
      toast({
        title: "Request submitted",
        description: "We'll get back to you soon!",
      });
      
      form.reset();
    } catch (error: any) {
      console.error("API error:", error);
      
      let errorMessage = "There was a problem submitting your request. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: "123 Tech Park Drive, San Francisco, CA 94107"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "(555) 123-4567"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@launch.ai"
    }
  ];

  const solutions = [
    { value: "analytics", label: "AI-Powered Analytics" },
    { value: "automation", label: "Intelligent Automation" },
    { value: "customer-experience", label: "Customer Experience AI" },
    { value: "predictive", label: "Predictive Intelligence" },
    { value: "nlp", label: "Natural Language Processing" },
    { value: "custom", label: "Custom AI Development" }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Have questions or ready to get started? Fill out the form below and our team will contact you shortly.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company" {...field} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Solution of Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                            <SelectValue placeholder="Select a solution" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {solutions.map((solution) => (
                            <SelectItem key={solution.value} value={solution.value}>
                              {solution.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your project or requirements" 
                          {...field} 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-cyan-600 text-white font-semibold rounded-md hover:opacity-90 transition duration-300"
                >
                  Submit Request
                </Button>
              </form>
            </Form>
          </motion.div>
          
          <motion.div 
            className="flex flex-col justify-between"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-2 bg-cyan-600/10 rounded-full mr-4">
                      <info.icon className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{info.title}</p>
                      <p className="text-gray-600">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-4">Office Hours</h3>
              <p className="text-gray-600 mb-6">Monday - Friday: 9:00 AM - 6:00 PM PST<br/>Saturday - Sunday: Closed</p>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold mb-2">Need immediate assistance?</h4>
              <p className="text-gray-600 mb-4">Our team is available for live chat during business hours.</p>
              <a href="#" className="inline-flex items-center text-primary font-medium hover:text-cyan-600 transition duration-300">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Live Chat
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
