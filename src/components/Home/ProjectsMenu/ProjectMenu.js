import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Projects } from '../../../static-data/projectData';
import * as classes from './ProjectMenu.module.css';
import ProjectItem from './ProjectItem/ProjectItem';
import Button from '../../UI/Button/button';

const projectMenu = ({ menuState, closeMenu }) => {
	const container = {
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				delayChildren: 0.7,
				staggerChildren: 0.35,
				ease: [0.83, 0, 0.17, 1],
			},
		},
		hide: {
			opacity: 0,
			y: '100%',
			scale: 1.15,
		},
	};

	const children = {
		show: { opacity: 1, y: 0, scale: 1 },
		hide: {
			opacity: 0,
			y: '100%',
			scale: 1.15,
		},
	};
	return (
		<>
			<AnimatePresence>
				{menuState && (
					<motion.div
						className={classes.Background}
						initial={{ y: '100%' }}
						exit={{ y: '100%' }}
						animate={{ y: 0 }}
						transition={{
							duration: 0.9,
							ease: [0.6, 0.04, -0.01, 0.9],
							delay: -0.2,
						}}
					>
						<motion.div
							className={classes.Menu}
							initial={{ y: '100%' }}
							exit={{ y: '100%' }}
							animate={{ y: 0 }}
							transition={{
								duration: 0.7,
								ease: [0.6, 0.04, -0.01, 0.9],
								// delay: 0.3,
							}}
						>
							<div className={classes.TopBar}>
								<h4 className={classes.TextHeading}>projects</h4>
								<Button clicked={closeMenu}>
									<h4 className={classes.TextHeading}>close</h4>
								</Button>
							</div>
							<motion.div
								className={classes.ListContainer}
								initial="hide"
								variants={container}
								animate="show"
							>
								{Projects.map((item) => (
									<Link t0="/" key={item.id + item.title} variants={children}>
										<ProjectItem
											number={item.orderNo}
											name={item.title}
											key={item.id + item.title}
											variants={children}
										/>
									</Link>
								))}
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default projectMenu;
