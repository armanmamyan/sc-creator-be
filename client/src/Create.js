import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { smartContractDetails } from "./utils";
import ContractCard from "./components/ContractCard";
import Header from "./components/Header";
import Form from "./Form";

function Create() {
  const contractForm = useRef(null);
  const [toogleForm, setToggleForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState('');
  const [contract, setContract] = useState("");

  const handleContractSelection = (e) => {
    const { id } = e.currentTarget;
    setContract(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const templateParams = {
      from_name: name,
      message: message, 
    };
   

    const {status} = await emailjs.send(
        "service_jxz7id5",
        "template_143c0rr",
        templateParams,
        "3coCXw2-i_7J-r96o"
      );

      if(status === 200) {
        setMessage('');
        setName('');
      } else {
        alert("Something went wrong. please try again later");
      }

  };

  return (
    <>
      <Header />
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
        <div className="feedback--container z-20">
          {!toogleForm ? (
            <button
              type="button"
              onClick={() => setToggleForm(true)}
              className="feedback--btn relative block bg-blue text-white w-14 h-14 rounded-full text-xl"
              data-tooltip="Have questions or suggestions?"
            >
              <i className="fa-solid fa-message"></i>
            </button>
          ) : (
            <form className="feedback-form bg-white p-6 w-64 shadow-xl rounded" onSubmit={handleSubmit}>
              <button type="button" className="feedback--close-btn w-7 h-7 text-xl brand--btn rounded-full" onClick={() => setToggleForm(false)}>
              <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="flex flex-col border-b border-blue mb-6">
                  <label className="mb-4 text-sm" htmlFor="name">Your Name</label>
                  <input name='name' id="name" type="text" className="focus:outline-none text-sm" onChange={(e) => setName(e.target.value)} value={name} />
              </div>
              <div className="flex flex-col border-b border-blue mb-6">
                  <label className="mb-4 text-sm" htmlFor="message">Your feedback</label>
                  <textarea rows={3} cols={10} name='message' id="message" type="text" className="focus:outline-none text-sm" onChange={(e) => setMessage(e.target.value)} value={message} />
              </div>
              <button type="submit" className="brand--btn p-3 rounded-md w-full">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Create;
