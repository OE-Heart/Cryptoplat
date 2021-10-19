// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";

contract NFTAuction is ERC721 {
    // using SafeMath for uint256;
    // 拍卖的参数。
    address payable public beneficiary;
    // 时间是unix的绝对时间戳（自1970-01-01以来的秒数）
    // 或以秒为单位的时间段。
    uint public endTime;

    struct NFTItem {
        address payable owner;
        uint256 minBid;
        string ipfsURL;
        bool exist;
    }

    uint256 public _tokenIDs;
    uint256 public _NFTItemIDs;

    mapping(uint256 => NFTItem) private _NFTItems;

    struct BID {
        address payable highestBidder;
        uint highestBid;
    }

    mapping(uint256 => mapping(address => uint256)) public fundsByBidder; //map tokenid to fundsByBidder
    mapping(uint256 => BID) public Bid; 

    // 拍卖结束后设为 true，将禁止所有的变更
    bool ended;

    // 变更触发的事件
    event HighestBidIncreased(address bidder, uint amount);
    event BidWithdrawed(address withdrawer, uint amount);
    event AuctionEnded(address winner, uint amount);

    // 以下是所谓的 natspec 注释，可以通过三个斜杠来识别。
    // 当用户被要求确认交易时将显示。

    /// 以受益者地址 `_beneficiary` 的名义，
    /// 创建一个简单的拍卖，拍卖时间为 `_biddingTime` 秒。
    constructor(
        uint _biddingTime
    ) public ERC721("DART", "ART")
    {
        beneficiary = payable(msg.sender);
        endTime = block.timestamp + _biddingTime;
    }

    modifier notEnded() {
        require(
            block.timestamp <= endTime,
            "Auction already ended."
        );
        _;
    }

    modifier higherBid(uint256 ID) {
        NFTItem memory nftItem = _NFTItems[ID];
        if (msg.value < nftItem.minBid) revert();
        _;
    }

    modifier NFTItemExist(uint ID) {
        require(
            _NFTItems[ID].exist,
            "NFT item not found."
        );
        _;
    }

    modifier isOwner(uint256 ID) {
        NFTItem memory nftItem = _NFTItems[ID];
        if (msg.sender != nftItem.owner) revert();
        _;
    }

    modifier notOwner(uint256 ID) {
        NFTItem memory nftItem = _NFTItems[ID];
        if (msg.sender == nftItem.owner) revert();
        _;
    }

    function addNFTItem(uint256 minBid, string memory ipfsURL) public {
        require(
            minBid > 0,
            "The starting price should be greater than 0."
        );

        _NFTItemIDs++;
        _NFTItems[_NFTItemIDs] = NFTItem(payable(msg.sender), minBid, ipfsURL, true);
    }

    function getNFTItem(uint256 ID) public view NFTItemExist(ID)
    returns(uint256, uint256, string memory, uint256) {
        NFTItem memory nftItem = _NFTItems[ID];
        BID memory bid = Bid[ID];
        return(ID, nftItem.minBid, nftItem.ipfsURL, bid.highestBid);
    }

    /// 对拍卖进行出价，具体的出价随交易一起发送。
    /// 如果没有在拍卖中胜出，则返还出价。
    function increaseBid(uint256 ID) public payable notEnded notOwner(ID) higherBid(ID) 
    returns(bool succes) {
        BID storage bid = Bid[ID];

        if (msg.value <= bid.highestBid) revert();

        fundsByBidder[ID][msg.sender] = msg.value;

        bid.highestBidder = payable(msg.sender);
        bid.highestBid = msg.value;

        emit HighestBidIncreased(msg.sender, msg.value);

        return true;
    }

    /// 取回出价（当该出价已被超越）
    function withdraw(uint256 ID) public payable notOwner(ID)
    returns(bool success) {
        BID storage bid = Bid[ID];
        uint amount;
        if (msg.sender != bid.highestBidder) {
            amount = fundsByBidder[ID][msg.sender];
        } 

        if (amount <= 0) revert();

        fundsByBidder[ID][msg.sender] = 0;

        if (!payable(msg.sender).send(amount)) {
            fundsByBidder[ID][msg.sender] = amount;
            return false;
        }

        emit BidWithdrawed(msg.sender, amount);
        return true;
    }

    /// 结束拍卖，并把最高的出价发送给受益人
    function auctionEnd(uint256 ID) public {
        // 对于可与其他合约交互的函数（意味着它会调用其他函数或发送以太币），
        // 一个好的指导方针是将其结构分为三个阶段：
        // 1. 检查条件
        // 2. 执行动作 (可能会改变条件)
        // 3. 与其他合约交互
        // 如果这些阶段相混合，其他的合约可能会回调当前合约并修改状态，
        // 或者导致某些效果（比如支付以太币）多次生效。
        // 如果合约内调用的函数包含了与外部合约的交互，
        // 则它也会被认为是与外部合约有交互的。

        NFTItem storage nftItem = _NFTItems[ID];
        BID memory bid = Bid[ID];

        // 1. 条件
        require(block.timestamp >= endTime, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");

        // 2. 生效
        ended = true;
        emit AuctionEnded(bid.highestBidder, bid.highestBid);

        // 3. 交互
        nftItem.owner = bid.highestBidder;
        beneficiary.transfer(bid.highestBid);
    }
}