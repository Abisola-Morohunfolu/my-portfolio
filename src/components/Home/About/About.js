import * as classes from './About.module.css';
import { ReactComponent as HTMLLogo } from '../../../assets/svg/html5-1.svg';
import { ReactComponent as CSSLogo } from '../../../assets/svg/css-5.svg';
import { ReactComponent as SassLogo } from '../../../assets/svg/sass-1.svg';
import { ReactComponent as JSLogo } from '../../../assets/svg/logo-javascript.svg';
import { ReactComponent as TSLogo } from '../../../assets/svg/typescript.svg';
import { ReactComponent as ReactLogo } from '../../../assets/svg/react-2.svg';
import { ReactComponent as ApolloGQ } from '../../../assets/svg/apollo-graphql-1.svg';
import { ReactComponent as GitLG } from '../../../assets/svg/github-2.svg';
import { ReactComponent as LinkedLG } from '../../../assets/svg/linkedin.svg';

const About = () => (
	<section className={classes.About}>
		<h3 className={classes.Heading}>
			tools and languages that i use <span>&#9660;</span>
		</h3>
		<div className={classes.TextBox}>
			<HTMLLogo />
			<CSSLogo />
			<SassLogo />
			<JSLogo />
			<TSLogo />
			<ReactLogo />
			<ApolloGQ />
		</div>
		<div className={classes.ContactDetails}>
			<div className={classes.Socials}>
				<h5>
					connect with abisola on <span>&#9660;</span>
				</h5>
				<div>
					<a
						href="https://github.com/Abisola-Morohunfolu"
						target="_blank"
						rel="noreferrer noopener"
						className={classes.GitIcon}
					>
						<GitLG />
					</a>
					<a
						href="https://www.linkedin.com/in/bisola-morohunfolu-833354195/"
						target="_blank"
						rel="noreferrer noopener"
						className={classes.LinkedIcon}
					>
						<LinkedLG />
					</a>
				</div>
			</div>
			<p>or</p>
			<a href="mailto:bisola.morohunfolu@gmail.com" className={classes.Mail}>
				send me a mail
			</a>
		</div>
	</section>
);

export default About;
