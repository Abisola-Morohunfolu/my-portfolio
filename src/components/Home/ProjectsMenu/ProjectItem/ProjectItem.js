import * as classes from './ProjectItem.module.css';

const projectItem = ({ number, name }) => (
	<h4 className={classes.Text}>
		<span className={classes.Yellow}>{number}. </span>
		<span>{name}</span>
	</h4>
);

export default projectItem;
