// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CONTRACT_NAME is ERC721A, Ownable {

  uint256 public mintPrice = MINT_PRICE ether;
  uint256 public presalePrice = PRESALE_PRICE ether;
  uint256 public constant refundPeriod = REFUND_DAYS;
  uint256 public refundEndTime;
  address public refundAddress;

  uint256 private reserveAtATime = RESERVATION_ATIME;
  uint256 private reservedCount = 0;
  uint256 private maxReserveCount = MAX_RESERVATION;

  string _baseTokenURI;

  bool public isActive = false;
  bool public isPresaleActive = false;

  uint256 public MAX_SUPPLY = MAXIMUM_SUPPLY;
  uint256 public maxAllowedTokensPerPurchase = MAX_ALLOWED_TOKENS_PER_PURCHASE;
  uint256 public maxAllowedTokensPerWallet = MAX_ALLOWED_TOKENS_PER_WALLET;
  uint256 public presaleWalletLimitation = PRESALE_WALLET_LIMITATION;


  mapping(address => bool) private _allowList;
  mapping(address => uint256) private _allowListClaimed;

  constructor(string memory baseURI) ERC721A(NAME_WITH_SPACING, CONTRACT_SHORT_NAME) {
    setBaseURI(baseURI);
    toggleRefundCountdown();
  }

  modifier saleIsOpen {
    require(totalSupply() <= MAX_SUPPLY, "Sale has ended.");
    _;
  }

  modifier onlyAuthorized() {
    require(owner() == msg.sender);
    _;
  }

  function isRefundGuaranteeActive() public view returns (bool) {
    return (block.timestamp <= refundEndTime);
}

function getRefundGuaranteeEndTime() public view returns (uint256) {
    return refundEndTime;
}

function refund(uint256[] calldata tokenIds) external {
    require(isRefundGuaranteeActive(), "Refund expired");

    for (uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tokenId = tokenIds[i];
        require(msg.sender == ownerOf(tokenId), "Not token owner");
        transferFrom(msg.sender, refundAddress, tokenId);
    }

    uint256 refundAmount = tokenIds.length * mintPrice;
    Address.sendValue(payable(msg.sender), refundAmount);
}

function toggleRefundCountdown() public onlyOwner {
    refundEndTime = block.timestamp + refundPeriod;
}

function setRefundAddress(address _refundAddress) external onlyOwner {
    refundAddress = _refundAddress;
}

  function setMaximumAllowedTokens(uint256 _count) public onlyAuthorized {
    maxAllowedTokensPerPurchase = _count;
  }

  function setMaxAllowedTokensPerWallet(uint256 _count) public onlyAuthorized {
    maxAllowedTokensPerWallet = _count;
  }

  function togglePublicSale() public onlyAuthorized {
    isActive = !isActive;
  }

  function setMaxMintSupply(uint256 maxMintSupply) external  onlyAuthorized {
    MAX_SUPPLY = maxMintSupply;
  }

  function togglePresaleActive() external onlyAuthorized {
    isPresaleActive = !isPresaleActive;
  }

  function setPresaleWalletLimitation(uint256 maxMint) external  onlyAuthorized {
    presaleWalletLimitation = maxMint;
  }

  function addToWhiteList(address[] calldata addresses) external onlyAuthorized {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      _allowList[addresses[i]] = true;
      _allowListClaimed[addresses[i]] > 0 ? _allowListClaimed[addresses[i]] : 0;
    }
  }

  function checkIfOnWhiteList(address addr) external view returns (bool) {
    return _allowList[addr];
  }

  function removeFromWhiteList(address[] calldata addresses) external onlyAuthorized {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      _allowList[addresses[i]] = false;
    }
  }

  function allowListClaimedBy(address owner) external view returns (uint256){
    require(owner != address(0), 'Zero address not on Allow List');
    return _allowListClaimed[owner];
  }

  function setReserveAtATime(uint256 val) public onlyAuthorized {
    reserveAtATime = val;
  }

  function setMaxReserve(uint256 val) public onlyAuthorized {
    maxReserveCount = val;
  }

  function setPrice(uint256 _price) public onlyAuthorized {
    mintPrice = _price;
  }

  function setPresalePrice(uint256 _presalePrice) public onlyAuthorized {
    presalePrice = _presalePrice;
  }

  function setBaseURI(string memory baseURI) public onlyAuthorized {
    _baseTokenURI = baseURI;
  }

  function getReserveAtATime() external view returns (uint256) {
    return reserveAtATime;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

 function reserveNft() public onlyAuthorized {
    require(reservedCount <= maxReserveCount, "Max Reserves taken already!");

    _safeMint(msg.sender, reserveAtATime);

  }

  function adminAirdrop(address _walletAddress, uint256 _count) public onlyAuthorized {
    uint256 supply = totalSupply();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(supply <= MAX_SUPPLY, "Total supply spent.");

    _safeMint(_walletAddress, _count);

  }

  function batchAirdropToMultipleAddresses(uint256 _count, address[] calldata addresses) external onlyAuthorized {
    uint256 supply = totalSupply();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(supply <= MAX_SUPPLY, "Total supply spent.");

    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      _safeMint(addresses[i], _count);
    }
  }

  function mint(uint256 _count) public payable saleIsOpen {
    uint256 mintIndex = totalSupply();

    if (msg.sender != owner()) {
      require(isActive, "Sale is not active currently.");
      require(balanceOf(msg.sender) + _count <= maxAllowedTokensPerWallet, "Max holding cap reached.");
    }


    require(mintIndex + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(
      _count <= maxAllowedTokensPerPurchase,
      "Exceeds maximum allowed tokens"
    );

    require(msg.value >= mintPrice * _count, "Insufficient ETH amount sent.");
   
    _safeMint(msg.sender, _count);

  }

  function preSaleMint(uint256 _count) public payable saleIsOpen {
    uint256 mintIndex = totalSupply();

    require(isPresaleActive, 'Presale is not active');
    require(_allowList[msg.sender], 'You are not on the White List');
    
    require(mintIndex < MAX_SUPPLY, 'All tokens have been minted');
    require(_count <= presaleWalletLimitation, 'Cannot purchase this many tokens');
    require(_allowListClaimed[msg.sender] + _count <= presaleWalletLimitation, 'Purchase exceeds max allowed');
    require(msg.value >= presalePrice * _count, 'Insuffient ETH amount sent.');

    _safeMint(msg.sender,_count);
    
  }

  function withdraw() external onlyAuthorized {
    uint balance = address(this).balance;
    payable(owner()).transfer(balance);
  }
}