import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full bg-white z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Launch.ai</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#solutions" className="font-medium hover:text-primary transition duration-300">Solutions</a></li>
            <li><a href="#benefits" className="font-medium hover:text-primary transition duration-300">Benefits</a></li>
            <li><a href="#process" className="font-medium hover:text-primary transition duration-300">Our Process</a></li>
            <li><a href="#faq" className="font-medium hover:text-primary transition duration-300">FAQ</a></li>
            <li><a href="#contact" className="font-medium px-4 py-2 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-md hover:opacity-90 transition duration-300">Contact Us</a></li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white py-4 px-4 shadow-inner ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-4">
          <li><a href="#solutions" onClick={closeMenu} className="block font-medium hover:text-primary transition duration-300">Solutions</a></li>
          <li><a href="#benefits" onClick={closeMenu} className="block font-medium hover:text-primary transition duration-300">Benefits</a></li>
          <li><a href="#process" onClick={closeMenu} className="block font-medium hover:text-primary transition duration-300">Our Process</a></li>
          <li><a href="#faq" onClick={closeMenu} className="block font-medium hover:text-primary transition duration-300">FAQ</a></li>
          <li><a href="#contact" onClick={closeMenu} className="block font-medium text-center py-2 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-md hover:opacity-90 transition duration-300">Contact Us</a></li>
        </ul>
      </div>
    </header>
  );
}
