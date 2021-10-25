import React from "react";
import AuctionsOfNFT from "../../build/contracts/NFTAuction.json";

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
                {this.props.NFT.onSale ? (
                    <div>
                    <p>
                        <span className="font-weight-bold">Highest Bidder</span> :{" "}
                        {this.props.NFTContract.methods.getAuction(this.props.NFT.tokenID).highestBidder}
                    </p>
                    <p>
                        <span className="font-weight-bold">Highest Bid</span> :{" "}
                        {this.props.NFTContract.methods.getAuction(this.props.NFT.tokenID).highestBid}
                    </p>
                    <botton
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                        onClick={ () => {  //FIXME: Fail to bid now
                            this.props.NFTContract.methods.increaseBid(this.props.NFT.tokenID, this.props.NFT.price+1).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                              window.location.reload();
                            });
                          }}
                    >
                        Bid
                    </botton>
                    </div>
                ) : (
                    <botton
                        className="btn btn-outline-danger mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                    >
                        Not on sale
                    </botton>
                )}
            </div>
        )
    }
}

export default NFTinfo;