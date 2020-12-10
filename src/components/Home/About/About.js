import * as classes from './About.module.css';

const About = () => (
	<section className={classes.About}>
		<h3 className={classes.Heading}>About me</h3>
		<div className={classes.TextBox}>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<p>Lorem ipsum whtane agdt adjd gdua ejagd</p>
			<div className={classes.ContactDetails}>
				<p>Let's work together</p>
				<a href="mailto:bisola.morohunfolu@gmail.com">test@gmail.com</a>
			</div>
		</div>
	</section>
);

export default About;
