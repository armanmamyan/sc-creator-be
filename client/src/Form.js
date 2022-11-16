import { useState, forwardRef, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import toast from 'react-hot-toast'

const Form = forwardRef(({ contractName, setContract }, ref) => {
  // States
  const [contractDetails, setContractDetails] = useState({});
  const [hasWhitelist, setHasWhitelist] = useState(false);
  const [hasMerkle, setHasMerkle] = useState(false);
  const [downloadContent, setDownloadContent] = useState({
    url: "",
    fileName: "",
  });
  const [codemirror, setCodeMirror] = useState(
    `const code = "You Will see the generated code here"`
  );
  const [hasRevoke, setHasRevoke] = useState(false);
  
  // Constants
  const isRefund = contractName === "erc721R";

  // Handlers
  const checkContractType = () => {
    switch (contractName) {
      case "erc721R":
        return "erc721R"
      case "ERC721+":
        return "ERC721+"
      default:
        return "ERC721A"      
    }
  }
  
  const handleBg = () => {
    switch (contractName) {
      case "ERC721R":
        return document.body.setAttribute('style', 'background-color: #6a0ba1') 
      case "ERC721+":
        return document.body.setAttribute('style', 'background-color: #3d4a8e') 
      default:
        return document.body.setAttribute('style', 'background-color: #b91d44') 
    }
  };

  const handleSCDelete = useCallback(async (e) => {
    try {
      const fileObj = contractDetails.NAME_WITH_SPACING.replaceAll(" ", "");

      const deleteContract = await fetch(`api/delete-contract?contractName=${fileObj}`, {
        method: "DELETE",
      });
      setContractDetails({});
      const res = await deleteContract.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  },[contractDetails]);
    
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const contractCreationData = {
        ...contractDetails,
        IS_REVOKED: hasRevoke,
        WITH_REFUND: isRefund,
        CONTRACT_NAME: contractDetails.NAME_WITH_SPACING.replaceAll(" ", ""),
        CONTRACT_VERSION: isRefund ? "erc721A" : contractName.toUpperCase(),
      };
      try {
        const createContract = await fetch("api/create-contract", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contractCreationData),
        });

        const contractToText = await createContract.text();
        const url = `data:text/plain;charset=utf-8,${encodeURIComponent(
          contractToText
        )}`;

        setDownloadContent({
          url,
          fileName: `${contractDetails["NAME_WITH_SPACING"]}.sol`,
        });
        URL.revokeObjectURL(url);
        setCodeMirror(contractToText);
      } catch (error) {
        console.error(error);
      }
    },
    [contractDetails, contractName, hasRevoke, isRefund]
  );

  const handleGoBack = (e) => {
    document.body.removeAttribute('style') 
    setContract("");
  };

  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const type = target.dataset.label;
    const isBool =
      type === "has_whitelist" ||
      type === "has_revoke" || 
      type === "has_merkle";

    switch (type) {
      case "has_whitelist":
        setHasWhitelist(target.checked);
        break;
      case "has_merkle":
        setHasMerkle(target.checked);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(codemirror);
    toast.success('Copied')
  }

  // Effects
  useEffect(() => {
    window.addEventListener('beforeunload', handleSCDelete);

    return () => {
      window.removeEventListener('beforeunload', handleSCDelete);
    }
  }, [handleSCDelete])

  useEffect(() => {
    handleBg()
  },[])

  return (
    <div ref={ref} className={`form--row h-screen flex flex-col justify-center type-${checkContractType()?.toLowerCase()}`}>
      <div className="form--title flex items-center gap-3 mb-14">
        <button type="button" onClick={handleGoBack} className="form--btn_back">
          <i className="fa-solid fa-circle-arrow-left" />
        </button>
        <h2>{contractName.toUpperCase()}</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="form--container flex flex-wrap"
      >
        <div className="checkers flex items-center gap-8 mb-10 w-full px-5">
          <div className={`form-wrapper flex items-center px-4 py-3 ${hasMerkle ? 'disabled' : ''}`}>
            <label htmlFor="whitelist">Enable Standard Whitelist</label>
            <input
              id="whitelist"
              data-label="has_whitelist"
              className="form--radio"
              type="checkbox"
              disabled={hasMerkle}
              onChange={handleInputChange}
            />
            <span className="form--custom_checkbox"></span>
          </div>
          <div className={`form-wrapper flex items-center px-4 py-3 ${hasWhitelist ? 'disabled' : ''}`}>
            <label htmlFor="merkle">Enable Merkle Tree Whitelist</label>
            <input
              id="merkle"
              data-label="has_merkle"
              className="form--radio"
              type="checkbox"
              disabled={hasWhitelist}
              onChange={handleInputChange}
            />
            <span className="form--custom_checkbox"></span>
          </div>
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="withSpaces" className="mb-2 px-1">
            Contract Name
          </label>
          <input
            id="withSpaces"
            data-label="NAME_WITH_SPACING"
            className="form--input"
            type="text"
            placeholder="Contract Name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="short" className="mb-2 px-1">
            Contract Symbol
          </label>
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
          <div className="form-wrapper-input flex flex-col w-2/6 px-5">
            <label htmlFor="refundDays" className="mb-2 px-1">
              Refund period:
            </label>
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
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="supply" className="mb-2 px-1">
            Collection Total Supply
          </label>
          <input
            id="supply"
            data-label="maximum_supply"
            className="form--input"
            type="number"
            placeholder="7777"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="price" className="mb-2 px-1">
            Mint price in eth
          </label>
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
        {(hasWhitelist || hasMerkle) && (
          <>
            <div className="form-wrapper-input flex flex-col w-2/6 px-5">
              <label htmlFor="presaleprice" className="mb-2 px-1">
                Presale price in eth
              </label>
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
            <div className="form-wrapper-input flex flex-col w-2/6 px-5">
              <label htmlFor="presalewallet" className="mb-2 px-1">
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
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="tx" className="mb-2 px-1">
            Maximum tokens per Transaction
          </label>
          <input
            id="tx"
            data-label="max_allowed_tokens_per_purchase"
            className="form--input"
            type="number"
            placeholder="10"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="wallet" className="mb-2 px-1">
            Maximum tokens per wallet
          </label>
          <input
            id="wallet"
            data-label="max_allowed_tokens_per_wallet"
            className="form--input"
            type="number"
            placeholder="15"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="reserve" className="mb-2 px-1">
            Maximum reservation for marketing
          </label>
          <input
            id="reserve"
            data-label="max_reservation"
            className="form--input"
            type="number"
            placeholder="250"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper-input flex flex-col w-2/6 px-5">
          <label htmlFor="reserveperClick" className="mb-2 px-1">
            Reservation Per 1 TX.
          </label>
          <div
            className="tooltip"
            data-tooltip="Should be lower than max. Attention the highest the number the high the risk of long or unfulfilled TX"
          >
            <i className="fa-solid fa-circle-exclamation"></i>
          </div>
          <input
            id="reserveperClick"
            data-label="reservation_atime"
            className="form--input"
            type="number"
            placeholder="125"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper-input w-full px-5">
          <button type="submit" className="form--btn form--btn-submit">
            Next
          </button>
        </div>
      </form>
      <div className="form--result flex gap-5 mt-10">
          <div className="submission-code pb-5 px-6 w-2/3">
            <CodeMirror
              value={codemirror}
              height=""
              theme="dark"
              extensions={[javascript({ jsx: true })]}
              editable={false}
            />
          </div>
          <div className="contract--actions flex flex-col gap-5 w-1/3 flex-shrink-0">
            <div className="action--btn-wrapper">
              <a
                href={downloadContent.url}
                download={downloadContent.fileName}
                onClick={handleSCDelete}
                className="form--btn btn--download uppercase"
              >
                Download contract
              </a>
            </div>
            <div className="action--btn-wrapper">
              <button
                type="button"
                onClick={handleCopy}
                className="form--btn uppercase"
              >
                Copy the code
              </button>
            </div>
            <div className="action--btn-wrapper">
              <a
                href="https://remix.ethereum.org/"
                target='_blank'
                rel="norefferer"
                onClick={handleSCDelete}
                className="form--btn uppercase"
              >
                Go to REMIX
              </a>
            </div>
          </div>
      </div>
    </div>
  );
});

export default Form;
