import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';
import { fadeIn } from '../../utils/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

const AnimatedSection = ({
  children,
  variants = fadeIn,
  className = '',
  threshold = 0.2,
  triggerOnce = true,
  delay = 0
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
