import React from "react";

class NFTinfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div key={this.props.NFT.tokenID} className="mt-4">
                <p>
                    <span className="font-weight-bold">tokenID</span> :{" "}
                    {this.props.NFT.tokenID}
                </p>
                <p>
                    <span className="font-weight-bold">Name</span> :{" "}
                    {this.props.NFT.tokenName}
                </p>
                <p>
                    <span className="font-weight-bold">Minted By</span> :{" "}
                    {this.props.NFT.mintedBy}
                </p>
                <p>
                    <span className="font-weight-bold">Current Owner</span> :{" "}
                    {this.props.NFT.currentOwner}
                </p>
                <p>
                    <span className="font-weight-bold">Previous Owner</span> :{" "}
                    {this.props.NFT.previousOwner}
                </p>
                <p>
                    <span className="font-weight-bold">Price</span> :{" "}
                    {window.web3.utils.fromWei(this.props.NFT.price,"Ether")} ETH
                </p>
                <p>
                    <span className="font-weight-bold">Number of Transfers</span> :{" "}
                    {this.props.NFT.transNum}
                </p>
                {
                    this.props.accountAddress === this.props.NFT.currentOwner ? (
                        !this.props.NFT.onSale ? (
                            <button
                                className="btn btn-outline-success mt-4 w-50"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                onClick={ () => {
                                    let minBid = prompt("Please input minBid");
                                    let duration = prompt("Please input duration");
                                    this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, minBid, duration).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                                        window.location.reload();
                                    });
                                }}
                            >
                                Sale
                            </button>
                        ) : (
                            <p>
                                <span className="font-weight-bold">End Time</span> :{" "}
                                {this.props.Auction.endTime}
                            </p>
                        )
                    ) : (
                        this.props.NFT.onSale ? (
                            !this.props.Auction.ended ? (
                                <div>
                                <p>
                                    <span className="font-weight-bold">Highest Bidder</span> :{" "}
                                    {this.props.Auction.highestBidder}
                                </p>
                                <p>
                                    <span className="font-weight-bold">Highest Bid</span> :{" "}
                                    {this.props.Auction.highestBid}
                                </p>
                                <botton
                                    className="btn btn-outline-success mt-4 w-50"
                                    style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                    onClick={ () => {
                                        let bid = prompt("Please input your bid");
                                        this.props.NFTContract.methods.increaseBid(this.props.NFT.tokenID, bid).send({ from: this.props.accountAddress, gas: '3000000'});
                                      }}
                                >
                                    Bid
                                </botton>
                                </div>
                            ) : (
                                !this.props.Auction.claimed ? (
                                    this.props.accountAddress === this.props.Auction.highestBidder ? (
                                        <botton
                                            className="btn btn-outline-success mt-4 w-50"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                            onClick={ () =>{
                                                this.props.NFTContract.methods.claimNFT(this.props.NFT.tokenID).send({from: this.props.accountAddress, value: this.props.Auction.highestBid, gas: '3000000'});
                                            }}
                                        >
                                            Claim
                                        </botton>
                                    ) : (
                                        <botton
                                            className="btn btn-outline-danger mt-4 w-50"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                        >
                                            Waiting for claimed
                                        </botton>
                                    )
                                ) : (
                                    <div></div>
                                )
                            )
        
                        ) : (
                            <botton
                                className="btn btn-outline-danger mt-4 w-50"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                            >
                                Not on sale
                            </botton>
                        )
                    )
                }
            </div>
        )
    }
}

export default NFTinfo;