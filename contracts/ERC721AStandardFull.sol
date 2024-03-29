// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CONTRACT_NAME is ERC721A, ReentrancyGuard, Ownable {
  event SetMaximumAllowedTokens(uint256 _count);
  event SetMaximumSupply(uint256 _count);
  event SetMaximumAllowedTokensPerWallet(uint256 _count);
  event SetMaxTokenForPresale(uint256 _count);
  event SetRoot(bytes32 _root);
  event SetPrice(uint256 _price);
  event SetPresalePrice(uint256 _price);
  event SetBaseUri(string baseURI);
  event Mint(address userAddress, uint256 _count);

  address public constant proxyRegistryAddress = 0xa5409ec958C83C3f309868babACA7c86DCB077c1;


  uint256 public mintPrice = MINT_PRICE ether;
  uint256 public presalePrice = PRESALE_PRICE ether;
  uint256 public refundPeriod = REFUND_DAYS days;

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

  constructor(string memory baseURI) ERC721A("NAME_WITH_SPACING", "CONTRACT_SHORT_NAME") {
    setBaseURI(baseURI);
    toggleRefundCountdown();
  }

  modifier saleIsOpen {
    require(totalSupply() < MAX_SUPPLY, "Sale has ended.");
    _;
  }

  modifier mintCompliance(uint256 _mintAmount) {
    require(tx.origin == msg.sender, "Calling from other contract is not allowed.");
    require(
      _mintAmount > 0 && numberMinted(msg.sender) + _mintAmount <= maxAllowedTokensPerWallet,
       "Invalid mint amount or minted max amount already."
    );
    _;
  }

  modifier presaleMintCompliance(uint256 _mintAmount) {
    require(tx.origin == msg.sender, "Calling from other contract is not allowed.");
    require(
      _mintAmount > 0 && numberMinted(msg.sender) + _mintAmount <= presaleWalletLimitation,
       "Invalid mint amount or minted max amount already."
    );
    _;
  }

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  function isApprovedForAll(address owner, address operator)
        override
        public
        view
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
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

  function setRefundPeriod(uint256 _refundPeriod) external onlyOwner {
    refundPeriod = _refundPeriod;
  }

  function toggleRefundCountdown() public onlyOwner {
      refundEndTime = block.timestamp + refundPeriod;
  }

  function setRefundAddress(address _refundAddress) external onlyOwner {
      refundAddress = _refundAddress;
  }

  function setMaximumAllowedTokens(uint256 _count) public onlyOwner {
    maxAllowedTokensPerPurchase = _count;
    emit SetMaximumAllowedTokens(_count);
  }

  function setMaxAllowedTokensPerWallet(uint256 _count) public onlyOwner {
    maxAllowedTokensPerWallet = _count;
    emit SetMaximumAllowedTokensPerWallet(_count);
  }

  function togglePublicSale() public onlyOwner {
    isActive = !isActive;
  }

  function setMaxMintSupply(uint256 maxMintSupply) external  onlyOwner {
    MAX_SUPPLY = maxMintSupply;
    emit SetMaximumSupply(maxMintSupply);
  }

  function togglePresaleActive() external onlyOwner {
    isPresaleActive = !isPresaleActive;
  }

  function setPresaleWalletLimitation(uint256 maxMint) external  onlyOwner {
    presaleWalletLimitation = maxMint;
    emit SetMaxTokenForPresale(maxMint);
  }

  function addToWhiteList(address[] calldata addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      _allowList[addresses[i]] = true;
      _allowListClaimed[addresses[i]] > 0 ? _allowListClaimed[addresses[i]] : 0;
    }
  }

  function checkIfOnWhiteList(address addr) external view returns (bool) {
    return _allowList[addr];
  }

  function removeFromWhiteList(address[] calldata addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      _allowList[addresses[i]] = false;
    }
  }

  function allowListClaimedBy(address owner) external view returns (uint256){
    require(owner != address(0), 'Zero address not on Allow List');
    return _allowListClaimed[owner];
  }

  function setReserveAtATime(uint256 val) public onlyOwner {
    reserveAtATime = val;
  }

  function setMaxReserve(uint256 val) public onlyOwner {
    maxReserveCount = val;
  }

  function setPrice(uint256 _price) public onlyOwner {
    mintPrice = _price;
    emit SetPrice(_price);
  }

  function setPresalePrice(uint256 _presalePrice) public onlyOwner {
    presalePrice = _presalePrice;
    emit SetPresalePrice(_presalePrice);
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    _baseTokenURI = baseURI;
    emit SetBaseUri(baseURI);
  }

  function getReserveAtATime() external view returns (uint256) {
    return reserveAtATime;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

 function reserveNft() public onlyOwner {
    require(reservedCount <= maxReserveCount, "Max Reserves taken already!");
    reservedCount += reserveAtATime;
    _safeMint(msg.sender, reserveAtATime);
  }

  function adminAirdrop(uint256 _count, address _address) external onlyOwner saleIsOpen {
    uint256 supply = totalSupply();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    _safeMint(_address, _count);
  }

  function batchAirdropToMultipleAddresses(uint256 _count, address[] calldata addresses) external onlyOwner saleIsOpen {
    uint256 supply = totalSupply();

    for (uint256 i = 0; i < addresses.length; i++) {
      require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
      require(addresses[i] != address(0), "Can't add a null address");
      _safeMint(addresses[i], _count);
    }
  }

  function mint(uint256 _count) public payable mintCompliance(_count) saleIsOpen {
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
    emit Mint(msg.sender, _count);
  }

  function preSaleMint(uint256 _count) public payable presaleMintCompliance(_count) saleIsOpen {
    uint256 mintIndex = totalSupply();

    require(isPresaleActive, 'Presale is not active');
    require(_allowList[msg.sender], 'You are not on the White List');
    
    require(mintIndex + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(msg.value >= presalePrice * _count, 'Insuffient ETH amount sent.');

    _safeMint(msg.sender,_count);
     emit Mint(msg.sender, _count);
  }

  function withdraw() external onlyOwner nonReentrant {
    uint balance = address(this).balance;
    Address.sendValue(payable(owner()), balance);  
  }
}

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}