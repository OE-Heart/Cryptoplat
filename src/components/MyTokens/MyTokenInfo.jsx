import React from "react";

class MyTokenInfo extends React.Component {
    render() {
        return (
            <div className="col-md-6 text-center">
                    <div key={this.props.NFT.tokenID} className="mt-4 ml-3">
                      <p>
                        <span className="font-weight-bold">tokenID</span> :{" "}
                        {this.props.NFT.tokenID}
                      </p>
                      <p>
                        <span className="font-weight-bold">Name</span> :{" "}
                        {this.props.NFT.currentOwnertokenName}
                      </p>
                      <p>
                        <span className="font-weight-bold">Price</span> :{" "}
                        {window.web3.utils.fromWei(this.props.NFT.price, "Ether")} ETH
                      </p>
                      <p>
                        <span className="font-weight-bold">Number of Transfers</span>:{" "}
                        {this.props.NFT.transNum}
                      </p>
                    </div>
                    {this.props.NFT.onSale ? (
                      <div>
                      {/* <p>
                          <span className="font-weight-bold">Highest Bidder</span> :{" "}
                          {this.props.Auction.highestBidder}
                      </p> */}
                      <p>
                          <span className="font-weight-bold">Highest Bid</span> :{" "}
                          {this.props.Auction.highestBid}
                      </p>
                      <p>
                          <span className="font-weight-bold">End Time</span> :{" "}
                          {this.props.Auction.endTime}
                      </p>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                        onClick={ () => {
                            this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, 0, 100).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                            window.location.reload();
                          });
                        }}
                      >
                        Sale
                      </button>
                    )}
                  </div>
        )
    }
}

export default MyTokenInfo;