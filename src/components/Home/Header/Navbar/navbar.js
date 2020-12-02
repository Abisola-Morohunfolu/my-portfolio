import Button from '../../../UI/Button/button';
import * as classes from './navbar.module.css';
import { motion } from 'framer-motion';

const navbar = () => (
	<nav className={classes.Navbar}>
		<motion.h1
			className={classes.Heading}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: 1.5, ease: 'linear', duration: 0.8 }}
		>
			abisola
		</motion.h1>
		<Button>
			<motion.h1
				className={classes.Heading}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 1.5, ease: 'easeIn', duration: 0.8 }}
			>
				projects
			</motion.h1>
		</Button>
	</nav>
);

export default navbar;
