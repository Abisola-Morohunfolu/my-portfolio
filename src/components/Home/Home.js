import * as React from 'react';

import Navbar from './Header/Navbar/navbar';
import Header from './Header/header';
import ProjectMenu from './ProjectsMenu/ProjectMenu';
import FeaturedProject from './FeaturedProject/FeaturedProject';
import About from './About/About';

const Home = () => {
	const [toggleMenu, setToggleMenu] = React.useState(false);

	const hideMenu = () => setToggleMenu(false);
	const showMenu = () => setToggleMenu(true);
	return (
		<>
			<Navbar showMenu={showMenu} />
			<Header />
			<ProjectMenu menuState={toggleMenu} closeMenu={hideMenu} />
			<FeaturedProject showProjects={showMenu} />
			<About />
		</>
	);
};

export default Home;
