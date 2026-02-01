import { Projects, Project } from '../../static-data/projectData';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { slideUp, projectCardAnimation } from '../../utils/animations';

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        !isEven ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={projectCardAnimation}
    >
      {/* Image Section */}
      <motion.div
        className="relative overflow-hidden rounded-2xl group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <div className="aspect-video relative bg-dark-surface">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-accent/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl font-semibold flex items-center gap-2"
            >
              View Project
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div>
        <span className="text-accent text-lg font-mono">{project.orderNo}</span>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-3">
          {project.title}
        </h3>
        <p className="text-xl text-lime mb-4">{project.subtitle}</p>
        <p className="text-gray-400 text-lg mb-6">{project.fullDescription}</p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-dark-surface text-gray-300 rounded-full text-sm border border-dark-border"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Highlights */}
        <ul className="space-y-2 mb-6">
          {project.highlights.map((highlight, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2 text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <span className="text-lime mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
              {highlight}
            </motion.li>
          ))}
        </ul>

        {/* Role Badge */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Role:</span>
          <span className="text-sm text-white bg-dark-border px-3 py-1 rounded-full">
            {project.role}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const FeaturedProject = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="py-20 px-8 md:px-20" id="works">
      {/* Section Header */}
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? 'visible' : 'hidden'}
        variants={slideUp}
        className="mb-20"
      >
        <h2 className="text-section font-bold text-gray-400 mb-4">Works</h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
          A selection of my recent projects
        </p>
      </motion.div>

      {/* Project Cards */}
      <div className="space-y-24 lg:space-y-32">
        {Projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProject;
