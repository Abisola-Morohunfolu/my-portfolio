const Navbar = () => (
  <nav className="p-2 px-4 md:p-[2.5rem] flex justify-between items-center overflow-hidden fixed top-0 left-0 right-0 z-30 bg-light_background">
    <span className="text-2xl md:text-3xl relative text-secondary">
      abisola
    </span>
    <a
      href="#works"
      className="text-2xl md:text-3xl relative text-secondary cursor-pointer"
    >
      Works
    </a>
  </nav>
);

export default Navbar;
