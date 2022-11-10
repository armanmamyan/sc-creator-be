import { useState, useRef } from "react";
import { smartContractDetails } from "./utils";
import ContractCard from "./components/ContractCard";
import Header from './components/Header';
import Form from "./Form";

function Create() {
  const contractForm = useRef(null);
  const [contract, setContract] = useState("");

  const handleContractSelection = (e) => {
    const { id } = e.currentTarget;
    setContract(id);
  };

  return (
    <>
      <Header/>
      <div className="relative gear-container pr-20 pl-8">
        {!contract ? (
          <div className="sc-selector h-screen flex flex-col justify-center">
            <h1 className="sticky top-0 text-3xl font-bold mb-20 text-black text-center pb-3">
              Choose your smart contract!
            </h1>
            <div className="flex align-center justify-center wrap gap-6 sc--cards-container">
              {smartContractDetails.map(
                ({
                  id,
                  type,
                  subtitle,
                  founders,
                  listOfPerks,
                  fullDescription,
                  fullDescription2,
                  image,
                }) => {
                  const descIsMoreThan1 = fullDescription.length > 1;
                  const descIsMoreThan2 = fullDescription2.length > 1;
                  return (
                    <ContractCard
                      key={id}
                      id={id}
                      image={image}
                      descIsMoreThan1={descIsMoreThan1}
                      descIsMoreThan2={descIsMoreThan2}
                      type={type}
                      subtitle={subtitle}
                      founders={founders}
                      listOfPerks={listOfPerks}
                      fullDescription={fullDescription}
                      fullDescription2={fullDescription2}
                      handleContractSelection={handleContractSelection}
                    />
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <Form
            setContract={setContract}
            contractName={contract}
            ref={contractForm}
          />
        )}
      </div>
    </>
  );
}

export default Create;
