import { Projects } from "../../static-data/projectData.ts";

import { motion } from "framer-motion";


const FeaturedProject = () => {

  return (
      <section className="p-20 overflow-hidden" id="works">
        <h2 className="text-primary text-5xl uppercase mb-4">Works</h2>
        <div className="flex md:ml-28 md:mt-12 relative flex-wrap">
            {Projects.map((project) => (
                <motion.div key={project.id} className="md:w-1/2 p-2 md:p-6 h-[60vh] md:h-[80vh]">
                    <h3 className="text-2xl uppercase mb-2 text-light_background">{project.title}</h3>
                    <a href={project.demoLink} rel="noopener noreferrer" target="_blank">
                        <span className="sr-only">View project</span>
                        <img
                            className="object-cover h-[80%] w-full"
                            src={project.image}
                            alt={project.title}
                        />
                    </a>
                </motion.div>
            ))}
        </div>
      </section>
  );
};

export default FeaturedProject;
