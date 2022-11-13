// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CONTRACT_NAME is ERC721, ReentrancyGuard, Ownable {
  event SetMaximumAllowedTokens(uint256 _count);
  event SetMaximumSupply(uint256 _count);
  event SetMaximumAllowedTokensPerWallet(uint256 _count);
  event SetMaxTokenForPresale(uint256 _count);
  event SetRoot(bytes32 _root);
  event SetPrice(uint256 _price);
  event SetPresalePrice(uint256 _price);
  event SetBaseUri(string baseURI);
  event Mint(address userAddress, uint256 _count);

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
  uint256 public presaleWalletLimitation = PRESALE_WALLET_LIMITATION;

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
    require(_tokenSupply.current() < MAX_SUPPLY, "Sale has ended.");
    _;
  }

  function setMerkleRootHash(bytes32 _rootHash) public onlyOwner {
    merkleRoot = _rootHash;
    emit SetRoot(_rootHash);
  }

  function tokensMinted() public view returns (uint256) {
    return _tokenSupply.current();
  }

  function setMaximumAllowedTokens(uint256 _count) public onlyOwner {
    maxAllowedTokensPerPurchase = _count;
    emit SetMaximumAllowedTokens(_count);
  }

  function setMaxAllowedTokensPerWallet(uint256 _count) public onlyOwner {
    maxAllowedTokensPerWallet = _count;
    emit SetMaximumAllowedTokensPerWallet(_count);
  }

  function setPresaleWalletLimitation(uint256 maxMint) external  onlyOwner {
    presaleWalletLimitation = maxMint;
    emit SetMaxTokenForPresale(maxMint);
  }

  function togglePublicSale() public onlyOwner {
    isActive = !isActive;
  }

  function togglePreSale() external onlyOwner {
    isPresaleActive = !isPresaleActive;
  }

  function setMaxMintSupply(uint256 maxMintSupply) external  onlyOwner {
    MAX_SUPPLY = maxMintSupply;
    emit SetMaximumSupply(maxMintSupply);
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

    uint256 i;

    for (i = 0; i < reserveAtATime; i++) {
      _tokenSupply.increment();
      _safeMint(msg.sender, _tokenSupply.current());
      reservedCount++;
    }
  }

  function adminAirdrop(address _walletAddress, uint256 _count) public onlyOwner saleIsOpen {
    uint256 supply = _tokenSupply.current();

    require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");
    
    for (uint256 i = 0; i < _count; i++) {
      _tokenSupply.increment();
      _safeMint(_walletAddress, _tokenSupply.current());
    }
  }

  function batchAirdropToMultipleAddresses(uint256 _count, address[] calldata addresses) external onlyOwner saleIsOpen {
    uint256 supply = _tokenSupply.current();


    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add a null address");
      require(supply + _count <= MAX_SUPPLY, "Total supply exceeded.");

      for(uint256 j = 0; j < _count; j++) {
        _tokenSupply.increment();
        _safeMint(addresses[i], _tokenSupply.current());
      }
    }
  }

  function mint(uint256 _count) public payable saleIsOpen {
    require(tx.origin == msg.sender, "Calling from other contract is not allowed.");
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
    emit Mint(msg.sender, _count);
  }

  function preSaleMint(bytes32[] calldata _merkleProof, uint256 _count) public payable isValidMerkleProof(_merkleProof) saleIsOpen {

    require(isPresaleActive, "Presale is not active");
    require(tx.origin == msg.sender, "Calling from other contract is not allowed.");
    require(balanceOf(msg.sender) + _count <= presaleWalletLimitation, "Cannot purchase this many tokens");
    require(msg.value >= presalePrice * _count, "Insufficient ETH amount sent.");
    
     for (uint256 i = 0; i < _count; i++) {
      _tokenSupply.increment();
      _safeMint(msg.sender, _tokenSupply.current());
    }
    emit Mint(msg.sender, _count);
  }

  function withdraw() external onlyOwner nonReentrant {
    uint balance = address(this).balance;
    Address.sendValue(payable(owner()), balance);  
  }
}