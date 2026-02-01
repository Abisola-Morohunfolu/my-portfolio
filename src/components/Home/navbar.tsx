import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Works', href: '#works' },
    { label: 'Skills', href: '#skills' },
  ];

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50
        p-4 px-8 md:px-16
        flex justify-between items-center
        transition-all duration-300
        ${scrolled ? 'bg-background/90 backdrop-blur-md py-3' : 'bg-transparent py-6'}
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.a
        href="#"
        className="text-2xl md:text-3xl font-bold text-white"
        whileHover={{ scale: 1.05 }}
      >
        abisola
      </motion.a>

      <div className="flex items-center gap-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="text-lg text-gray-300 hover:text-white transition-colors relative group"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime group-hover:w-full transition-all duration-300" />
          </motion.a>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
