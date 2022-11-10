import { Link } from "react-router-dom";
import Banner from './assets/banner.gif'

function App() {
  return (
    <div className="relative px-10 flex items-center justify-between h-screen home--banner overflow-hidden">
      <div className="w-1/2">
        <h1 className="font-bold lg:text-6xl uppercase mb-10">
          Time for free contract
        </h1>
        <h2 className="text-4xl font-medium mb-10">
          All contracts have been audited and used worldwide
        </h2>
        <Link
          to="create"
          className="relative text-center uppercase font-light tracking-widest h-28 lg:w-96 text-2xl flex items-center justify-center rounded-2xl build--btn"
        >
          <span className="z-10">build now</span>
        </Link>
      </div>
      <div className="w-1/2 relative">
        <span className="border-bg" />
        <div className="relative ml-auto z-10 overflow-hidden">
            <img src={Banner} alt="" className="w-96 h-96 object-cover rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default App;
