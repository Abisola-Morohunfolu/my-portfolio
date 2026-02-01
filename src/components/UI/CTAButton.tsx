import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const CTAButton = ({
  href,
  onClick,
  children,
  variant = 'primary',
  className = ''
}: CTAButtonProps) => {
  const baseClasses = `
    relative inline-flex items-center gap-3 px-8 py-4
    text-lg font-semibold rounded-full overflow-hidden
    group cursor-pointer
  `;

  const variants = {
    primary: 'bg-lime text-background hover:bg-orange',
    secondary: 'border-2 border-lime text-lime hover:bg-lime hover:text-background'
  };

  const ButtonContent = () => (
    <>
      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
        {children}
      </span>
      <motion.span
        className="relative z-10"
        animate={{ x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default CTAButton;
