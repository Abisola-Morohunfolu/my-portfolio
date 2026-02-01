import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GitLG from '../../assets/svg/github-2.svg';
import LinkedLG from '../../assets/svg/linkedin.svg';
import CTAButton from '../UI/CTAButton';
import { slideUp } from '../../utils/animations';

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="min-h-[60vh] px-8 md:px-20 py-20 bg-dark-surface flex flex-col justify-center"
      id="contact"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={slideUp}
        className="max-w-4xl"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          Let's build something{' '}
          <span className="bg-gradient-to-r from-lime to-orange bg-clip-text text-transparent">
            amazing
          </span>{' '}
          together
        </h2>

        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl">
          I'm always interested in hearing about new projects and opportunities.
          Whether you have a question or just want to say hi, feel free to reach
          out!
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <CTAButton href="mailto:bisola.morohunfolu@gmail.com">
            Get In Touch
          </CTAButton>

          <div className="flex gap-4">
            <motion.a
              href="https://github.com/Abisola-Morohunfolu"
              target="_blank"
              rel="noreferrer noopener"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center hover:bg-lime transition-colors group"
            >
              <img
                src={GitLG}
                className="w-6 h-6 invert group-hover:invert-0"
                alt="GitHub"
              />
              <span className="sr-only">View Abisola's GitHub</span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/bisola-morohunfolu-833354195/"
              target="_blank"
              rel="noreferrer noopener"
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center hover:bg-lime transition-colors group"
            >
              <img
                src={LinkedLG}
                className="w-6 h-6 invert group-hover:invert-0"
                alt="LinkedIn"
              />
              <span className="sr-only">View Abisola's LinkedIn</span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-20 pt-8 border-t border-dark-border"
      >
        <p className="text-gray-500">
          Designed & Built by Abisola Morohunfolu. {new Date().getFullYear()}
        </p>
      </motion.footer>
    </section>
  );
};

export default About;
