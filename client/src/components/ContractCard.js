import { ReactComponent as Star } from "../assets/star.svg";

const ContractCard = ({id,image, type, subtitle, founders, listOfPerks, descIsMoreThan1 = false, descIsMoreThan2=false, handleContractSelection, fullDescription, fullDescription2}) => (
  <div
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

export default ContractCard;
