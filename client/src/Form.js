import { useState, forwardRef } from "react";

const Form = forwardRef(({ contractName }, ref) => {
  const is721 = contractName === "erc721";
  const is721A = contractName === "erc721A";
  const isRefund = contractName === "refund";

  const [contractDetails, setContractDetails] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const type = target.dataset.label;
    const isBool =
      type === "has_whitelist" ||
      type === "has_refund" ||
      type === "has_revoke";

    setContractDetails({
      ...contractDetails,
      [type.toUpperCase()]: isBool ? target.checked : target.value,
    });
  };

  return (
    <div ref={ref} className="row form--row">
      <form onSubmit={handleSubmit} className="form--container">
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
          <input
            id="name"
            data-label="contract_name"
            className="form--input"
            type="text"
            placeholder="Contract Name Without Spaces: ContractName"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="withSpaces"
            data-label="contract_name_with_spacing"
            className="form--input"
            type="text"
            placeholder="Contract Name With Spaces: Contract Name"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="short"
            data-label="contract_short_name"
            className="form--input"
            type="text"
            placeholder="Contract Abbreviation: CN"
            onChange={handleInputChange}
          />
        </div>
        {isRefund && (
          <div className="form-wrapper">
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
          <input
            id="price"
            data-label="maximum_supply"
            className="form--input"
            type="number"
            placeholder="Collection Total Supply"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="price"
            data-label="mint_price"
            className="form--input"
            type="number"
            placeholder="Mint price in eth: 0.08"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="presaleprice"
            data-label="presale_price"
            className="form--input"
            type="number"
            placeholder="Presale price in eth: 0.08"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="tx"
            data-label="max_allowed_tokens_per_purchase"
            className="form--input"
            type="number"
            placeholder="Maximum tokens per TX"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="wallet"
            data-label="max_allowed_tokens_per_wallet"
            className="form--input"
            type="number"
            placeholder="Maximum tokens per wallet"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="presalewallet"
            data-label="presale_wallet_limitation"
            className="form--input"
            type="number"
            placeholder="Maximum tokens for presale purchase"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="reserve"
            data-label="max_reservation"
            className="form--input"
            type="number"
            placeholder="Maximum reservation for marketing"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <input
            id="reserveperClick"
            data-label="reservation_atime"
            className="form--input"
            type="number"
            placeholder="Reservation Per 1 TX. Should be lower than max"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-wrapper">
          <button type="submit" className='form--btn'>
                Next
          </button>
        </div>
      </form>
    </div>
  );
});

export default Form;
