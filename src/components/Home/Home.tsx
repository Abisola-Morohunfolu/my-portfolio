import Navbar from './navbar';
import Header from './header';
import Skills from './Skills';
import FeaturedProject from './featured-project';
import About from './about';

const Home = () => {
	return (
		<>
			<Navbar />
			<Header />
			<Skills />
			<FeaturedProject />
			<About />
		</>
	);
};

export default Home;
