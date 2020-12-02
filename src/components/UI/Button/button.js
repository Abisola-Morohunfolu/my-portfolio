import * as classes from './button.module.css';

const button = (props) => <button className={classes.button}>{props.children}</button>;

export default button;
