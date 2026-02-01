import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skillsData } from '../../static-data/skillsData';
import { slideUp, staggerContainer, fadeIn } from '../../utils/animations';

const Skills = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      className="min-h-screen bg-background py-20 px-8 md:px-20"
      id="skills"
      ref={ref}
    >
      {/* Section Header */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={slideUp}
        className="mb-16"
      >
        <h2 className="text-section font-bold text-gray-400 mb-4">My Stack</h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
          Technologies and tools I use to bring ideas to life
        </p>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsData.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            className="bg-dark-surface rounded-2xl p-8 border border-dark-border hover:border-accent transition-colors duration-300"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {category.title}
            </h3>
            <p className="text-gray-400 mb-6">{category.description}</p>

            {/* Skills Badges */}
            <motion.div
              className="flex flex-wrap gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {category.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={fadeIn}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'var(--color-lime)',
                    color: 'var(--background)'
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium cursor-default
                    bg-dark-border text-gray-300 transition-colors duration-200"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
