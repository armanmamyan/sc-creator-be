import Brand from "./assets/brand.gif";

const Header = () => (
    <header className="side-header w-20 h-screen py-5 px-4">
    <div className="brand w-12 h-12 mx-auto rounded-lg overflow-hidden">
      <img
        src={Brand}
        alt="NFT Gear Brand"
        className="w-100 h-100 object-cover"
      />
    </div>
    <h2 className='mt-3 text-2xl text-center'>Beta</h2>
  </header>
)

export default Header;