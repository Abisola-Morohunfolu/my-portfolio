import Navbar from './navbar.tsx';
import Header from './header.tsx';
import FeaturedProject from './featured-project.tsx';
import About from './about';

const Home = () => {
	return (
		<>
			<Navbar />
			<Header />
			<FeaturedProject />
			<About />
		</>
	);
};

export default Home;
