// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import ERC721 iterface
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// NFTs smart contract inherits ERC721 interface
contract NFTAuction is ERC721URIStorage{

    // this contract's token collection name
    string public collectionName;
    // this contract's token symbol
    string public collectionNameSymbol;
    // total number of crypto boys minted
    uint256 public NFTCounter;

    struct NFT {
        uint256 tokenID;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        uint256 transNum;
        bool onSale;
    }

    struct Auction {
        uint256 minBid;
        address payable highestBidder;
        uint256 highestBid;
        uint endTime;
        bool ended;
        bool claimed;
    }

    mapping(uint256 => NFT) public allNFTs;
    mapping(uint256 => Auction) public AuctionsOfNFT;
    mapping(uint256 => mapping(address => uint256)) public fundsByBidder; //map tokenID to fundsByBidder

    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;

    // initialize contract while deployment with contract's collection name and token
    constructor() ERC721("NFT Collection", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    modifier notZeroAddress() {
        require(
            msg.sender != address(0),
            "The fucntion caller is zero address account."
        );
        _;
    }

    modifier isOwner(uint256 _tokenID) {
        require(
            msg.sender == ownerOf(_tokenID),
            "Only owner can call this function."
        );
        _;
    }

    modifier notOwner(uint256 _tokenID) {
        require(
            msg.sender != ownerOf(_tokenID),
            "Owner cannot call this function."
        );
        _;
    }

    modifier notEnded(uint256 _tokenID) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(
            block.timestamp <= auction.endTime,
            "Auction already ended."
        );
        _;
    }

    modifier tokenExist(uint256 _tokenID) {
        require(
            _exists(_tokenID),
            "Token ID does not exist."
        );
        _;
    }

    // mint a new NFT
    function mintNFT(string memory _name, string memory  _tokenURI, uint256 _price) external notZeroAddress {
        // increment counter
        NFTCounter++;
        // check if a token exists with the above token id =>   incremented counter
        require(!_exists(NFTCounter));
        // check if the token URI already exists or not
        require(!tokenURIExists[_tokenURI]);
        // check if the token name already exists or not
        require(!tokenNameExists[_name]);
    
        // mint the token
        _safeMint(msg.sender, NFTCounter);
        // set token URI (bind token id with the passed in token URI)
        _setTokenURI(NFTCounter, _tokenURI);
    
        // make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
        // make token name passed as exists
        tokenNameExists[_name] = true;
    
        // creat a new NFT (struct) and pass in new values
        NFT memory newNFT = NFT(
            NFTCounter,
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            0,
            false
        );
        // add the token id and it's NFT to all NFTs mapping
        allNFTs[NFTCounter] = newNFT;
    }
  
    // get owner of the token
    function getTokenOwner(uint256 _tokenID) public view returns  (address) {
        address _tokenOwner = ownerOf(_tokenID);
        return _tokenOwner;
    }
  
    // get metadata of the token
    function getTokenMetaData(uint _tokenID) public view returns  (string memory) {
      string memory tokenMetaData = tokenURI(_tokenID);
      return tokenMetaData;
    }
  
    // get total number of tokens minted so far
    function getNumberOfTokensMinted() public view returns(uint256) {
      uint256 totalNumberOfTokensMinted = NFTCounter;
      return totalNumberOfTokensMinted;
    }
  
    // get total number of tokens owned by an address
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
      uint256 totalNumberOfTokensOwned = balanceOf(_owner);
      return totalNumberOfTokensOwned;
    }
  
    function beginAuction(uint256 _tokenID, uint256 _minBid, uint _endTime) tokenExist(_tokenID) isOwner(_tokenID) public returns (bool success) {
        NFT memory nft = allNFTs[_tokenID];
        nft.onSale = true;
        Auction memory newAuction = Auction(
            _minBid,
            payable(msg.sender),
            _minBid,
            _endTime,
            false,
            false
        );

        allNFTs[_tokenID] = nft;
        AuctionsOfNFT[_tokenID] = newAuction;
        return true;
    }

    function increaseBid(uint256 _tokenID, uint256 newBid) tokenExist(_tokenID) notOwner(_tokenID) notEnded(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        if (newBid <= auction.highestBid) revert();
        
        fundsByBidder[_tokenID][msg.sender] = newBid;
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = newBid;
        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function endAuction(uint256 _tokenID) tokenExist(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        if (block.timestamp < auction.endTime) revert();

        NFT memory nft = allNFTs[_tokenID];
        nft.onSale = false;
        auction.ended = true;

        allNFTs[_tokenID] = nft;
        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function withdraw(uint256 _tokenID) public tokenExist(_tokenID) notOwner(_tokenID) returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        if (!auction.ended) revert();
        if (msg.sender == auction.highestBidder) revert();
        address payable withdrawAccount;
        uint withdrawAmount;

        withdrawAccount = payable(msg.sender);
        withdrawAmount = fundsByBidder[_tokenID][withdrawAccount];

        if (withdrawAmount == 0) revert();

        fundsByBidder[_tokenID][withdrawAccount] = 0;
        if (!payable(msg.sender).send(withdrawAmount)) {
            fundsByBidder[_tokenID][withdrawAccount] = withdrawAmount;
            return false;
        }
        return true;
    }

    function claimNFT(uint256 _tokenID) public payable tokenExist(_tokenID) notZeroAddress returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(auction.ended);
        require(!auction.claimed);
        require(msg.sender == auction.highestBidder);
        // get the token's owner
        address tokenOwner = ownerOf(_tokenID);
        // token's owner should not be an zero address account
        require(tokenOwner != address(0));

        NFT memory nft = allNFTs[_tokenID];
        _transfer(tokenOwner, msg.sender, _tokenID);
        // get owner of the token
        address payable sendTo = nft.currentOwner;
        // send token's worth of ethers to the owner
        sendTo.transfer(msg.value);
        nft.previousOwner = nft.currentOwner;
        nft.currentOwner = payable(msg.sender);
        nft.price = auction.highestBid;
        nft.transNum++;
        allNFTs[_tokenID] = nft;
        return true;
    }
}