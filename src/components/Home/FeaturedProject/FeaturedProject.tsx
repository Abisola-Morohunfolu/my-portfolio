import * as React from "react";

import * as classes from "./Featured.module.css";
import Button from "../../UI/Button/button";
// import { ReactComponent as RightArrow } from "../../../assets/svg/RightArrow.svg";
import { Projects } from "../../../static-data/projectData";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeaturedProject = ({ showProjects }) => {
  const animation = useAnimation();
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px",
  });

  const randomNumber = Math.floor(Math.random() * Projects.length);

  console.log(randomNumber);

  React.useEffect(() => {
    if (imageInView) {
      animation.start("scaleDown");
      animation.start("expand");
      animation.start("show");
    }
  }, [animation, imageInView]);

  return (
    <section className={classes.FeaturedProject}>
      <h3 className={classes.Heading}>Featured Project</h3>
      <div className={classes.Project}>
        <div className={classes.ImageContainer} ref={imageRef}>
          <motion.div
            animate={animation}
            className={classes.ImageCover}
            initial="initial"
            variants={{
              initial: { width: "120%", left: 0 },
              scaleDown: {
                width: 0,
                left: "100%",

                transition: {
                  duration: 1.3,
                  ease: [0.37, 0, 0.63, 1],
                },
              },
            }}
          ></motion.div>
          <img
            className={classes.ProjectImage}
            src={Projects[randomNumber].image}
            alt={Projects[randomNumber].title}
          />
        </div>
        <motion.div
          className={classes.ProjectInfo}
          animate={animation}
          initial="hide"
          variants={{
            hide: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                duration: 0.5,
                delay: 0.7,
                ease: [0.5, 0, 0.75, 0],
              },
            },
          }}
        >
          <motion.div
            className={classes.ProjectInfoCover}
            animate={animation}
            initial="initial"
            variants={{
              initial: { height: "100%", top: 0 },
              expand: {
                height: 0,
                top: "100%",
                transition: {
                  duration: 0.7,
                  delay: 0.7,
                  ease: [0.5, 0, 0.75, 0],
                },
              },
            }}
          ></motion.div>
          <div className={classes.ProjectInfoText}>
            <h5 className={classes.ProjectName}>
              {Projects[randomNumber].title}
            </h5>
            <p>{Projects[randomNumber].description}</p>
            <a
              href={Projects[randomNumber].demoLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              <div className={classes.ProjectInfoButton}>
                <h5>Live Demo</h5>
                {/* <RightArrow /> */}
              </div>
            </a>
          </div>
        </motion.div>
      </div>
      <div className={classes.ButtonContainer}>
        <Button clicked={showProjects}>
          <div className={classes.AllProjectButton}>
            <h5 className={classes.ButtonText}>All Projects</h5>
            {/* <RightArrow /> */}
          </div>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProject;
