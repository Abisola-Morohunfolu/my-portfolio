import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CTAButton from '../UI/CTAButton';
import { staggerContainer, charAnimation, slideUp } from '../../utils/animations';

const Header = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const firstName = 'abisola';
  const lastName = 'morohunfolu';

  return (
    <header className="min-h-screen bg-background p-8 md:p-16 lg:p-20 flex items-center relative overflow-hidden">
      {/* Background gradient orb */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full" ref={ref}>
        <div className="relative z-10">
          {/* Animated Name */}
          <motion.h1
            className="text-hero font-bold leading-tight lowercase text-white mb-6"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <div className="overflow-hidden">
              {firstName.split('').map((char, i) => (
                <motion.span
                  key={`first-${i}`}
                  variants={charAnimation}
                  custom={i}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="overflow-hidden">
              {lastName.split('').map((char, i) => (
                <motion.span
                  key={`last-${i}`}
                  variants={charAnimation}
                  custom={i + firstName.length}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.h1>

          {/* Subtitle with gradient text */}
          <motion.p
            className="text-xl md:text-2xl leading-relaxed text-gray-300 max-w-2xl mb-10"
            variants={slideUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            Full stack developer crafting{' '}
            <span className="bg-gradient-to-r from-lime to-orange bg-clip-text text-transparent font-semibold">
              accessible, high-performance
            </span>{' '}
            web solutions. Focused on data and AI to create meaningful,
            user-centered products.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <CTAButton href="mailto:bisola.morohunfolu@gmail.com">
              Let's Connect
            </CTAButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-gray-500 text-sm mb-2 tracking-wider uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-lime to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </header>
  );
};

export default Header;
