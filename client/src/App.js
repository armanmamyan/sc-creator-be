import { Link } from "react-router-dom";
import Banner from "./assets/banner.gif";

function App() {
  return (
    <div className="relative overflow-hidden home">
      <div className="container px-10 mx-auto flex items-center h-screen">
        <div className="w-1/2">
          <h1 className="font-bold lg:text-6xl uppercase mb-10">
            Time for free contract
          </h1>
          <h2 className="text-4xl font-medium mb-14">
            Easily mint your NFTs on Ethereum without writing a single line of
            code. <br />
            Project was made to make even conditions for everyone to create an
            NFT collection with high quality smart contracts.
          </h2>
          <Link
            to="create"
            className="relative text-center uppercase font-medium tracking-widest h-28 lg:w-96 text-2xl flex items-center justify-center rounded-2xl build--btn"
          >
            <span className="z-10">build now</span>
          </Link>
        </div>
        <div className="w-1/2 home--item">
          <div className="border-bg flex items-center justify-center z-10 overflow-hidden">
              <img
                src={Banner}
                alt=""
                className="w-96 h-96 object-cover rounded-2xl"
              />

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
