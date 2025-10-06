const Header = () => {
  return (
    <header className="min-h-screen bg-[#f5f1e8] p-8 md:p-16 lg:p-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold leading-tight lowercase text-gray-900">
              abisola
              <br />
              morohunfolu
            </h1>
            <p className="text-lg md:text-2xl leading-relaxed text-gray-800">
              I am a self taught full-stack developer interested in creating
              websites and other random tools on the internet.
            </p>
          </div>
      </div>
    </header>
  );
};

export default Header;
