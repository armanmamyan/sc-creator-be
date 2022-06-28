import { useState, forwardRef, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const Form = forwardRef(({ contractName, setContract }, ref) => {
  const [contractDetails, setContractDetails] = useState({});
  const [hasWhitelist, setHasWhitelist] = useState(false);
  const [downloadContent, setDownloadContent] = useState({
    url: "",
    fileName: "",
  });
  const [codemirror, setCodeMirror] = useState(
    `const code = "You Will see the generated code here"`
  );
  const [hasRefund, setHasRefund] = useState(false);
  const [hasRevoke, setHasRevoke] = useState(false);
  const is721A = contractName === "erc721A";
  const isRefund = contractName === "refund";


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const contractCreationData = {
        ...contractDetails,
        CONTRACT_VERSION: contractName.toUpperCase(),
      };

      try {
        const createContract = await fetch("/api/create-contract", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contractCreationData),
        });

        const contractToText = await createContract.text();
        const url = `data:text/plain;charset=utf-8,${encodeURIComponent(contractToText)}`;

        setDownloadContent({
          url,
          fileName: `${contractDetails["NAME_WITH_SPACING"]}.sol`,
        });
        URL.revokeObjectURL(url);
        setCodeMirror(contractToText);
        setContractDetails({});
      } catch (error) {
        console.error(error);
      }
    },
    [contractDetails]
  );

  const handleGoBack = (e) => {
    const form = ref.current;
    const contractList = form.previousElementSibling;

    form.classList.remove("contract--selected");
    contractList.classList.remove("contract--selected");
    setContract("");
  };

  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const type = target.dataset.label;
    const isBool =
      type === "has_whitelist" ||
      type === "has_refund" ||
      type === "has_revoke";

    switch (type) {
      case "has_whitelist":
        setHasWhitelist(target.checked);
        break;
      case "has_refund":
        setHasRefund(target.checked);
        break;
      case "has_revoke":
        setHasRevoke(target.checked);
        break;
      default:
        break;
    }

    setContractDetails({
      ...contractDetails,
      [type.toUpperCase()]: isBool ? target.checked : target.value,
    });
  };

  return (
    <div ref={ref} className="form--row">
      <form onSubmit={handleSubmit} className="form--container">
        <button
          type="button"
          onClick={handleGoBack}
          className="form--btn form--btn_back"
        >
          <i className="fa-solid fa-circle-arrow-left" />
          <span>back</span>
        </button>
        <div className="checkers">
          <div className="form-wrapper">
            <input
              id="whitelist"
              data-label="has_whitelist"
              className="form--radio"
              type="checkbox"
              onChange={handleInputChange}
            />
            <span className="form--custom_checkbox"></span>
            <label htmlFor="whitelist">Are you going to have a whitelist</label>
          </div>
          {is721A && (
            <div className="form-wrapper">
              <input
                id="revoke"
                data-label="has_revoke"
                className="form--radio"
                type="checkbox"
                onChange={handleInputChange}
              />
              <span className="form--custom_checkbox"></span>
              <label htmlFor="revoke">
                Do you want to revoke Opensea listing gas fee ?
              </label>
            </div>
          )}
          {isRefund && (
            <>
              <div className="form-wrapper">
                <input
                  id="name"
                  data-label="refund_contract_version"
                  className="form--input"
                  type="text"
                  placeholder="ERC721A or ERC721+"
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
        </div>
        <div className="form-wrapper">
          <label htmlFor="name">
            Contract Name Without Spaces: ContractName
          </label>
          <input
            id="name"
            data-label="contract_name"
            className="form--input"
            type="text"
            placeholder="ContractName"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <label htmlFor="withSpaces">
            Contract Name With Spaces: Contract Name
          </label>
          <input
            id="withSpaces"
            data-label="NAME_WITH_SPACING"
            className="form--input"
            type="text"
            placeholder="Contract Name"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <label htmlFor="short">Contract Abbreviation: CN</label>
          <input
            id="short"
            data-label="contract_short_name"
            className="form--input"
            type="text"
            placeholder="CN"
            onChange={handleInputChange}
          />
        </div>
        {isRefund && (
          <div className="form-wrapper">
            <label htmlFor="refundDays">Refund period: 30 days</label>
            <input
              id="refundDays"
              data-label="refund_days"
              className="form--input"
              type="text"
              placeholder="Refund period: 30 days"
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="form-wrapper">
          <label htmlFor="supply">Collection Total Supply</label>
          <input
            id="supply"
            data-label="maximum_supply"
            className="form--input"
            type="number"
            placeholder="7777"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <label htmlFor="price">Mint price in eth</label>
          <input
            id="price"
            data-label="mint_price"
            className="form--input"
            type="number"
            placeholder="0.08"
            step="0.0001"
            onChange={handleInputChange}
          />
        </div>
        {hasWhitelist && (
          <>
            <div className="form-wrapper">
              <label htmlFor="presaleprice">Presale price in eth</label>
              <input
                id="presaleprice"
                data-label="presale_price"
                className="form--input"
                type="number"
                placeholder="0.055"
                step="0.0001"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-wrapper">
              <label htmlFor="presalewallet">
                Maximum tokens for presale purchase
              </label>
              <input
                id="presalewallet"
                data-label="presale_wallet_limitation"
                className="form--input"
                type="number"
                placeholder="2"
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        <div className="form-wrapper">
          <label htmlFor="tx">Maximum tokens per Transaction</label>
          <input
            id="tx"
            data-label="max_allowed_tokens_per_purchase"
            className="form--input"
            type="number"
            placeholder="10"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <label htmlFor="wallet">Maximum tokens per wallet</label>
          <input
            id="wallet"
            data-label="max_allowed_tokens_per_wallet"
            className="form--input"
            type="number"
            placeholder="15"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <label htmlFor="reserve">Maximum reservation for marketing</label>
          <input
            id="reserve"
            data-label="max_reservation"
            className="form--input"
            type="number"
            placeholder="250"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="reserveperClick"
            data-label="reservation_atime"
            className="form--input"
            type="number"
            placeholder="125"
            onChange={handleInputChange}
          />
          <label htmlFor="reserveperClick">
            Reservation Per 1 TX. Should be lower than max. Attention the
            highest the number the high the risk of long or unfulfilled TX
          </label>
        </div>
        <div className="form-wrapper">
          <button type="submit" className="form--btn">
            Next
          </button>
        </div>
      </form>
      <div>
        <div className="submission-code">
          <CodeMirror
            value={codemirror}
            height=""
            theme="dark"
            extensions={[javascript({ jsx: true })]}
            editable={false}
          />
        </div>
        <a
          href={downloadContent.url}
          download={downloadContent.fileName}
          className="form--btn btn--download"
        >
          Download contract
        </a>
      </div>
    </div>
  );
});

export default Form;
