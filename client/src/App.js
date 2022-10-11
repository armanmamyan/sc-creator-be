import { useState, useRef } from "react";
import { smartContractDetails } from "./utils";
import { ReactComponent as Azuki } from "./assets/azuki.svg";
import { ReactComponent as Star } from "./assets/star.svg";
import Form from "./Form";

function App() {
  const contractForm = useRef(null);
  const [contract, setContract] = useState("");

  const handleContractSelection = (e) => {
    const { id } = e.currentTarget;
    setContract(id);
  };

  return (
    <>
      <div className="relative gear-container pr-20 pl-8 pt-3">
        {!contract ? (
          <div className="sc-selector">
            <h1 className="sticky top-0 text-3xl font-bold mb-20 bg-black pb-3">
              Create you own Smart Contract with a few clicks <br />
            </h1>
            <div className="flex align-center justify-center wrap gap-5">

            {smartContractDetails.map(
              ({
                id,
                brand,
                type,
                subtitle,
                founders,
                listOfPerks,
                fullDescription,
                fullDescription2,
              }) => {
                const isAzuki = brand === "azuki";
                const descIsMoreThan1 = fullDescription.length > 1;
                const descIsMoreThan2 = fullDescription2.length > 1;
                return (
                  <div
                    key={id}
                    id={id}
                    className="sc-card flex flex-col justify-between items-start py-4 pl-4 pr-6 rounded-3xl mb-9 w-1/4"
                  >
                    <div
                      className={`sc-brand mr-2 w-56 h-40 flex items-center rounded-lg ${
                        isAzuki ? "bg-red" : ""
                      }`}
                    >
                      {isAzuki ? (
                        <Azuki className="w-3/4 h-3/4 m-auto" />
                      ) : (
                        <h2 className="font-bold lg:text-4xl md:text-3xl sm:text-xl text-center">
                          {brand}
                        </h2>
                      )}
                    </div>
                    <div>
                      <div className="sc-title mb-8 lg:gap-16 md:gap-12 sm:gap-8">
                        <div>
                          <h2 className="font-bold mb-2 text-lg">{type}</h2>
                          <h4 className="text-xs">{subtitle}</h4>
                        </div>
                        <div className="flex items-center self-start gap-2.5">
                          <div className="w-5 h-5">
                            <Star className="w-full h-full" />
                          </div>
                          <h4 className="text-xs">{founders}</h4>
                        </div>
                      </div>
                      <div className="sc-details flex flex-col gap-6">
                        <ul className="list-disc">
                          {listOfPerks.map((item, index) => (
                            <li key={`${index}_${item}`} className="mb-2">
                              <h4 className="text-xs">{item}</h4>
                            </li>
                          ))}
                        </ul>
                        <div className="max-w-300">
                          {descIsMoreThan1 ? (
                            <ul className="list-disc">
                              {fullDescription.map((item, index) => (
                                <li key={`${index}_${item}`} className="mb-2">
                                  <h4 className="text-xs">{item}</h4>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <h4 className="text-xs">{fullDescription[0]}</h4>
                          )}
                        </div>
                        <div className="max-w-xs">
                          {descIsMoreThan2 ? (
                            <ul className="list-disc">
                              {fullDescription2.map((item, index) => (
                                <li key={`${index}_${item}`} className="mb-2">
                                  <h4 className="text-xs">{item}</h4>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <h4 className="text-xs">{fullDescription2[0]}</h4>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleContractSelection}
                      className="bg-orange self-center w-40 h-14 shrink-0 rounded-2xl	font-medium text-sm mx-auto mt-5"
                    >
                      Create one
                    </button>
                  </div>
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

export default App;
