// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CONTRACT_NAME is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenSupply;
  Counters.Counter private _nextTokenId;
  
  uint256 public mintPrice = MINT_PRICE ether;
  uint256 public presalePrice = PRESALE_PRICE ether;

  bytes32 public merkleRoot;

  uint256 private reserveAtATime = RESERVATION_ATIME;
  uint256 private reservedCount = 0;
  uint256 private maxReserveCount = MAX_RESERVATION;

  string _baseTokenURI;

  bool public isActive = false;
  bool public isPresaleActive = false;

  uint256 public MAX_SUPPLY = MAXIMUM_SUPPLY;
  uint256 public maxAllowedTokensPerPurchase = MAX_ALLOWED_TOKENS_PER_PURCHASE;
  uint256 public maxAllowedTokensPerWallet = MAX_ALLOWED_TOKENS_PER_WALLET;

   modifier isValidMerkleProof(bytes32[] calldata merkleProof) {
        require(
            MerkleProof.verify(
                merkleProof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address does not exist in list"
        );
      _;
  }


  constructor(string memory baseURI, bytes32 _merkleRoot ) ERC721(NAME_WITH_SPACING, CONTRACT_SHORT_NAME) {
    setBaseURI(baseURI);
    setMerkleRootHash(_merkleRoot);
  }

  modifier saleIsOpen {
    require(_tokenSupply.current() <= MAX_SUPPLY, "Sale has ended.");
    _;
  }

  function setMerkleRootHash(bytes32 _rootHash) public onlyOwner {
    merkleRoot = _rootHash;
  }

  function tokensMinted() public view returns (uint256) {
    return _tokenSupply.current();
  }

  function setMaximumAllowedTokens(uint256 _count) public onlyOwner {
    maxAllowedTokensPerPurchase = _count;
  }

  function setMaxAllowedTokensPerWallet(uint256 _count) public onlyOwner {
    maxAllowedTokensPerWallet = _count;
  }

  function togglePublicSale() public onlyOwner {
    isActive = !isActive;
  }

  function togglePreSale() external onlyOwner {
    isPresaleActive = !isPresaleActive;
  }

  function setMaxMintSupply(uint256 maxMintSupply) external  onlyOwner {
    MAX_SUPPLY = maxMintSupply;
  }

  function setReserveAtATime(uint256 val) public onlyOwner {
    reserveAtATime = val;
  }

  function setMaxReserve(uint256 val) public onlyOwner {
    maxReserveCount = val;
  }

  function setPrice(uint256 _price) public onlyOwner {
    mintPrice = _price;
  }

  function setPresalePrice(uint256 _presalePrice) public onlyOwner {
    presalePrice = _presalePrice;
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    _baseTokenURI = baseURI;
  }

  function getReserveAtATime() external view returns (uint256) {
    return reserveAtATime;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

 function reserveNft() public onlyOwner {
    require(reservedCount <= maxReserveCount, "Max Reserves taken already!");

    uint256 i;

    for (i = 0; i < reserveAtATime; i++) {
      _tokenSupply.increment();
      _safeMint(msg.sender, _tokenSupply.current());
      reservedCount++;
    }
  }

  function adminAirdrop(address _walletAddress, uint256 _count) public onlyOwner {
    uint256 supply = _tokenSupply.current();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(supply <= MAX_SUPPLY, "Total supply spent.");
    
    for (uint256 i = 0; i < _count; i++) {
      _tokenSupply.increment();
      _safeMint(_walletAddress, _tokenSupply.current());
    }
  }

  function batchAirdropToMultipleAddresses(uint256 _count, address[] calldata addresses) external onlyOwner {
    uint256 supply = _tokenSupply.current();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    require(supply <= MAX_SUPPLY, "Total supply spent.");

    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");

      for(uint256 j = 0; j < _count; j++) {
        _tokenSupply.increment();
        _safeMint(addresses[i], _tokenSupply.current());
      }
    }
  }

  function mint(uint256 _count) public payable saleIsOpen {
    uint256 mintIndex = _tokenSupply.current();

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

    for (uint256 i = 0; i < _count; i++) {
      _tokenSupply.increment();
      _safeMint(msg.sender, _tokenSupply.current());
    }
  }

  function preSaleMint(bytes32[] calldata _merkleProof, uint256 _count) public payable isValidMerkleProof(_merkleProof) saleIsOpen {
    uint256 mintIndex = _tokenSupply.current();

    require(isPresaleActive, "Presale is not active");
    require(mintIndex < MAX_SUPPLY, "All tokens have been minted");
    require(balanceOf(msg.sender) + _count <= presaleWalletLimitation, "Cannot purchase this many tokens");
    require(msg.value >= presalePrice * _count, "Insufficient ETH amount sent.");
    
     for (uint256 i = 0; i < _count; i++) {
      _tokenSupply.increment();
      _safeMint(msg.sender, _tokenSupply.current());
    }

  }

  function withdraw() external onlyOwner {
    uint balance = address(this).balance;
    payable(owner()).transfer(balance);
  }
}