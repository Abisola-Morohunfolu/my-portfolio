import * as classes from './header.module.css';
import { motion } from 'framer-motion';

const header = () => {
	// animations

	const spanAnimate = {
		initial: {
			y: 110,
			skewY: 7,
		},
		animate: {
			y: 0,
			skewY: 0,
			transition: {
				delay: 0.5,
				duration: 1,
			},
		},
	};

	return (
		<header className={classes.Header}>
			<h1 className={classes.TextHeading}>
				<div className={classes.Block}>
					<motion.span
						className={classes.SpanBlock}
						variants={spanAnimate}
						initial="initial"
						animate="animate"
					>
						Hello!
					</motion.span>{' '}
				</div>
				<div className={classes.Block}>
					<motion.span
						className={classes.SpanBlock}
						variants={spanAnimate}
						initial="initial"
						animate="animate"
					>
						I am <span className={classes.YellowText}>Abisola,</span>
					</motion.span>{' '}
				</div>
				<div className={classes.Block}>
					<motion.span
						className={classes.SpanBlock}
						variants={spanAnimate}
						initial="initial"
						animate="animate"
					>
						a <span className={classes.YellowText}>Frontend Developer.</span>
					</motion.span>
				</div>
			</h1>
		</header>
	);
};

export default header;
