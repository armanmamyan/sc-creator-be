import { useState, useRef } from "react";
import { smartContractDetails } from "./utils";
import { ReactComponent as Star } from "./assets/star.svg";
import {Toaster} from 'react-hot-toast';
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
          <div className="sc-selector h-screen flex flex-col justify-center">
            <h1 className="sticky top-0 text-3xl font-bold mb-20 text-black text-center pb-3">
              Create you own Smart Contract with a few clicks <br />
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
                    <div
                      key={id}
                      id={id}
                      className="sc-card flex flex-col justify-between items-center py-4 pl-4 pr-6 rounded-3xl mb-9 w-1/4"
                    >
                      <div className="sc-banner z-10">
                        <img src={image} alt="" />
                      </div>
                      <div className="sc--content-wrapper px-4 py-6 z-10">
                        <div className="sc-title mb-8 lg:gap-16 md:gap-12 sm:gap-8">
                          <div>
                            <h2 className="font-bold mb-2 text-lg">{type}</h2>
                            <h4 className="text-md">{subtitle}</h4>
                          </div>
                          <div className="flex items-center self-start gap-2.5">
                            <div className="w-5 h-5">
                              <Star className="w-full h-full" />
                            </div>
                            <h4 className="text-md">{founders}</h4>
                          </div>
                        </div>
                        <div className="sc-details flex flex-col gap-6">
                          <ul className="list-disc">
                            {listOfPerks.map((item, index) => (
                              <li key={`${index}_${item}`} className="mb-2">
                                <h4 className="text-md">{item}</h4>
                              </li>
                            ))}
                          </ul>
                          <div className="max-w-300">
                            {descIsMoreThan1 ? (
                              <ul className="list-disc">
                                {fullDescription.map((item, index) => (
                                  <li key={`${index}_${item}`} className="mb-2">
                                    <h4 className="text-md">{item}</h4>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <h4 className="text-md">{fullDescription[0]}</h4>
                            )}
                          </div>
                          <div className="max-w-xs">
                            {descIsMoreThan2 ? (
                              <ul className="list-disc">
                                {fullDescription2.map((item, index) => (
                                  <li key={`${index}_${item}`} className="mb-2">
                                    <h4 className="text-md">{item}</h4>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <h4 className="text-md">{fullDescription2[0]}</h4>
                            )}
                          </div>
                        </div>
                        <button
                          id={id}
                          type="button"
                          onClick={handleContractSelection}
                          className="block text-white self-center w-40 h-14 shrink-0 rounded-2xl	font-medium text-md mx-auto mt-5"
                        >
                          Create one
                        </button>
                      </div>
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
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default App;
