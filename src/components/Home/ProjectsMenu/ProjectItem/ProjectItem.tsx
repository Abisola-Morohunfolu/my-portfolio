import * as classes from './ProjectItem.module.css';
import {motion} from 'framer-motion'

const projectItem = ({ number, name, variants }) => (
	<motion.h4 className={classes.Text} variants={variants}>
		<span className={classes.Yellow}>{number}. </span>
		<span>{name}</span>
	</motion.h4>
);

export default projectItem;
