import * as React from 'react';

import * as classes from './Featured.module.css';
import projectImage from '../../../assets/images/project.png';
import Button from '../../UI/Button/button';
import { ReactComponent as RightArrow } from '../../../assets/svg/RightArrow.svg';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturedProject = ({ showProjects }) => {
	const animation = useAnimation();
	const [imageRef, imageInView] = useInView({
		triggerOnce: true,
		rootMargin: '-295px',
	});

	React.useEffect(() => {
		if (imageInView) {
			animation.start('scaleDown');
			animation.start('expand');
			animation.start('showText');
			animation.start('slideIn');
		}
	}, [animation, imageInView]);

	return (
		<section className={classes.FeaturedProject}>
			<h3 className={classes.Heading}>Featured Project</h3>
			<div className={classes.Project}>
				<div>
					<motion.img
						animate={animation}
						ref={imageRef}
						src={projectImage}
						alt="My Quiz App"
						initial="initial"
						variants={{
							initial: { scale: 1.2, opacity: 0 },
							scaleDown: {
								scale: 1,
								opacity: 1,
								transition: {
									duration: 1,
									ease: [0.6, 0.05, -0.04, 0.9],
								},
							},
						}}
					/>
				</div>
				<motion.div
					animate={animation}
					className={classes.ProjectInfo}
					initial="closed"
					variants={{
						closed: { width: 0, opacity: 0 },
						expand: {
							width: '55rem',
							opacity: 1,
							transition: {
								duration: 1,
								delay: 1.4,
								ease: [0.6, 0.05, -0.01, 0.9],
							},
						},
					}}
				>
					<h5 className={classes.ProjectName}>Quiz App</h5>
					<motion.p
						animate={animation}
						initial="hideText"
						variants={{
							hideText: { opacity: 0, y: 100 },
							showText: {
								opacity: 1,
								y: 0,
								transition: { duration: 0.5, delay: 1.7, ease: 'easeInOut' },
							},
						}}
					>
						A fun Quiz App to help improve your knowledge of the world and other fascinating topics
					</motion.p>
					<Button>
						<motion.div
							className={classes.ProjectInfoButton}
							initial="hidden"
							variants={{
								hidden: { opacity: 0, y: 100, x: '100%' },
								slideIn: {
									opacity: 1,
									y: 0,
									x: '100%',
									transition: { duration: 0.5, delay: 1.8, ease: 'easeInOut' },
								},
							}}
						>
							<h5>Read More</h5>
							<RightArrow />
						</motion.div>
					</Button>
				</motion.div>
				<div className={classes.ButtonContainer}>
					<Button clicked={showProjects}>
						<div className={classes.AllProjectButton}>
							<h5 className={classes.ButtonText}>All Projects</h5>
							<RightArrow />
						</div>
					</Button>
				</div>
			</div>
		</section>
	);
};

export default FeaturedProject;
