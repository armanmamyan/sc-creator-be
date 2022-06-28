import { useState, useRef } from "react";
import Form from "./Form";
import Azuki from "./assets/azuki.png";
import ETH from "./assets/eth.png";

function App() {
  const contractForm = useRef(null);
  const [contract, setContract] = useState("");

  const handleContractSelection = (e) => {
    const { id, parentElement } = e.currentTarget;
    setContract(id);
    parentElement.classList.add("contract--selected");
    contractForm.current.classList.add("contract--selected");
  };

  return (
    <main>
      <h1>Create Your Own Smart Contract</h1>
      <div className="contract--container">
        <div className="sc-card-creator">
          <div
            id="erc721A"
            onClick={handleContractSelection}
            className="sc--card_item"
          >
            <h3>ERC721A</h3>
            <div className="sc--card_content">
              <a
                href="https://github.com/chiru-labs/ERC721A"
                target="_blank"
                rel="noopener noreferrer"
              >
                Created by Azuki team
              </a>
            </div>
            <img src={Azuki} alt="ERC721 A" />
          </div>
          <div
            id="erc721"
            onClick={handleContractSelection}
            className="sc--card_item"
          >
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
          <div
            id="refund"
            onClick={handleContractSelection}
            className="sc--card_item"
          >
            <h3>ERC721R</h3>
            <div className="sc--card_content">
              <a
                href="https://github.com/exo-digital-labs/ERC721R"
                target="_blank"
                rel="noopener noreferrer"
              >
                Created by EXO Digital Labs
              </a>
              <p>{`(Cut gas fee up to 70%)`}</p>
            </div>
            <div className="sc--card-refund">R</div>
          </div>
        </div>
        <Form
          setContract={setContract}
          contractName={contract}
          ref={contractForm}
        />
      </div>
    </main>
  );
}

export default App;