import { Link } from 'react-router-dom';

import { Projects } from '../../../static-data/projectData';
import * as classes from './ProjectMenu.module.css';
import ProjectItem from './ProjectItem/ProjectItem';
import Button from '../../UI/Button/button';

const projectMenu = () => (
	<div className={classes.Menu}>
		<div className={classes.TopBar}>
			<h4 className={classes.TextHeading}>projects</h4>
			<Button>
				<h4 className={classes.TextHeading}>close</h4>
			</Button>
		</div>
		<div className={classes.ListContainer}>
			{Projects.map((item) => (
				<Link t0="/" key={item.id + item.title}>
					<ProjectItem number={item.orderNo} name={item.title} key={item.id + item.title} />
				</Link>
			))}
		</div>
	</div>
);

export default projectMenu;
