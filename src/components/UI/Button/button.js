import * as classes from './button.module.css';

const button = (props) => (
	<button className={classes.button} onClick={props.clicked}>
		{props.children}
	</button>
);

export default button;
