import pawLogo from "../assets/paws-logo.png";

const Header = () => {
  return (
    <>
      <header className="header">
        <img src={pawLogo} alt="Paw Logo" className="pawLogo" />
        <h1 className="title">
          Find Your Purrfect
          <br /> Companion
        </h1>
        <p className="desc">Whiskers, cuddles, and endless purrs await.</p>
      </header>
    </>
  );
};

export default Header;
