const Header = () => {
	return (
		<header className="flex items-center justify-center text-center h-[50vh] lg:h-[100vh] p-8 relative text-3xl snap-start bg-light_background">
			<h1 className="flex-1 text-center text-3xl md:text-7xl text-secondary lg:leading-[7rem] md:max-w-[80%]">
				Hi! – I’m a <span className="text-accent">software developer</span> focused on crafting web applications that are inclusive and impactful.
			</h1>
		</header>
	);
};

export default Header;
