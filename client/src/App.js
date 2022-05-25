import Azuki from "./assets/azuki.png";
import ETH from "./assets/eth.png";

function App() {
  return (
    <main>
      <h1>Create Your Own Smart Contract</h1>
      <div className="container">
        <div className="row sc-card-creator">
          <div className="sc--card_item">
            <h3>ERC721A</h3>
            <div className="sc--card_content">
              <a
                href="https://github.com/chiru-labs/ERC721A"
                target="_blank"
                rel="noopener noreferrer"
              >
                Curated by Azuki team
              </a>
            </div>
            <img src={Azuki} alt="ERC721 A" />
          </div>
          <div className="sc--card_item">
            <h3>ERC721+</h3>
            <div className="sc--card_content">
              <a
                href="https://shiny.mirror.xyz/OUampBbIz9ebEicfGnQf5At_ReMHlZy0tB4glb9xQ0E"
                target="_blank"
                rel="noopener noreferrer"
              >
                Optimized Standard of ERC721
              </a>
              <p>{`(Cut gas fee up to 70%)`}</p>
            </div>
            <img src={ETH} alt="ERC721 Optimized" />
          </div>
          <div className="sc--card_item">
            <h3>ERC721R</h3>
            <div className="sc--card_content">
              <a
                href="https://github.com/exo-digital-labs/ERC721R"
                target="_blank"
                rel="noopener noreferrer"
              >
                Curated by EXO Digital Labs
              </a>
              <p>{`(Cut gas fee up to 70%)`}</p>
            </div>
            <div className="sc--card-refund">R</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
