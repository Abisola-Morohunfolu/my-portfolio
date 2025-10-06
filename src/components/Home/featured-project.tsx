import { Projects } from '../../static-data/projectData.ts';
import { motion } from 'framer-motion';

const FeaturedProject = () => {
  return (
    <section
      className="min-h-screen flex flex-col md:flex-row p-8 md:p-20 lg:p-80"
      id="works"
    >
      {/* Left Column - Title and Subtitle */}
      <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
        <motion.h2
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10 text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Works
        </motion.h2>
        <motion.p
          className="text-lg md:text-4xl text-slate-50 lg:w-5/6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A selection of my recent projects
        </motion.p>
      </div>

      {/* Right Column - Scrollable Projects */}
      <div className="w-full md:w-1/2 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
        {Projects.map((project, index) => (
            <a href={project.demoLink} rel="noopener noreferrer" target="_blank">
              <motion.div
                  key={project.id}
                  className="mb-12 group py-10"
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.5, delay: index * 0.1}}
              >
                <div className="mb-2">
                  <span className="text-xl md:text-2xl font-bold uppercase text-gray-400">
                    {project.orderNo}
                  </span>
                  <h3 className="text-2xl md:text-4xl lg:text-6xl font-semibold group-hover:text-primary transition-colors mt-5">
                    {project.title}
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 text-2xl my-3 lg:my-10">
                  {project.description ||
                      'Project description goes here. Click to view more details.'}
                </p>
                <div className="mt-4 h-px bg-gray-200 w-full"></div>
              </motion.div>
            </a>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
         display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProject;
