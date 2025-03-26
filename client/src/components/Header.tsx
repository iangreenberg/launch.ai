import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone } from "lucide-react";

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
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full bg-gray-100 text-gray-700 py-1 hidden md:block">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">856-520-8218</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#login" className="text-sm hover:text-primary transition-colors">CLIENT LOG IN</a>
              <a href="#contact" className="text-sm font-medium bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors">HAVE A QUESTION?</a>
            </div>
          </div>
        </div>
        
        {/* Logo */}
        <div className="flex items-center pt-5 md:pt-0">
          <Link href="/" className="text-3xl font-bold">
            <span className={`${isScrolled ? 'text-primary' : 'text-white'} transition-colors duration-300`}>LAUNCH.AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block pt-5 md:pt-0">
          <ul className="flex items-center space-x-8">
            <li className="group relative">
              <a href="#solutions" className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary transition duration-300 flex items-center`}>
                AI SOLUTIONS
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </li>
            <li className="group relative">
              <a href="#website" className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary transition duration-300 flex items-center`}>
                WEBSITE SOLUTIONS
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </li>
            <li><a href="#about" className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary transition duration-300`}>ABOUT</a></li>
            <li><a href="#insights" className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary transition duration-300`}>INSIGHTS</a></li>
            <li><a href="#contact" className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary transition duration-300`}>CONTACT</a></li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none pt-5 md:pt-0" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? 
            <X className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} /> : 
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
          }
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white py-6 px-6 shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-6">
          <a href="tel:856-520-8218" className="flex items-center text-gray-700">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">856-520-8218</span>
          </a>
          <a href="#login" className="text-sm text-gray-700 hover:text-primary transition-colors">CLIENT LOG IN</a>
        </div>
        <ul className="space-y-4">
          <li><a href="#solutions" onClick={closeMenu} className="block font-medium text-gray-800 hover:text-primary transition duration-300">AI SOLUTIONS</a></li>
          <li><a href="#website" onClick={closeMenu} className="block font-medium text-gray-800 hover:text-primary transition duration-300">WEBSITE SOLUTIONS</a></li>
          <li><a href="#about" onClick={closeMenu} className="block font-medium text-gray-800 hover:text-primary transition duration-300">ABOUT</a></li>
          <li><a href="#insights" onClick={closeMenu} className="block font-medium text-gray-800 hover:text-primary transition duration-300">INSIGHTS</a></li>
          <li><a href="#contact" onClick={closeMenu} className="block font-medium text-gray-800 hover:text-primary transition duration-300">CONTACT</a></li>
          <li><a href="#contact" onClick={closeMenu} className="block mt-6 font-medium text-center py-2 bg-primary text-white rounded hover:bg-primary/90 transition duration-300">HAVE A QUESTION?</a></li>
        </ul>
      </div>
    </header>
  );
}
