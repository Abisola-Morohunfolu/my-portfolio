const Navbar = () => (
	<nav
		className="p-2 px-4 md:p-[2.5rem] flex justify-between items-center overflow-hidden fixed top-0 left-0 right-0 z-30 bg-light_background border-b-[1px] md:border-b-2 border-secondary">
		<h1 className="uppercase text-2xl md:text-3xl relative text-secondary">
			Abisola
		</h1>
		<a href="#works" className="uppercase text-2xl md:text-3xl relative text-secondary">
			Works
		</a>
	</nav>
);

export default Navbar;
