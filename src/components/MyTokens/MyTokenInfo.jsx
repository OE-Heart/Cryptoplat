import React from "react";

class MyTokenInfo extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div className="col-md-6">
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
                      <p>
                          <span className="font-weight-bold">Highest Bidder</span> :{" "}
                          {this.props.Auction.highestBidder}
                      </p>
                      <p>
                          <span className="font-weight-bold">Highest Bid</span> :{" "}
                          {this.props.Auction.highestBid}
                      </p>
                      <p>
                          <span className="font-weight-bold">End Time</span> :{" "}
                          {this.props.Auction.endTime}
                      </p>
                      {this.props.currentTime >= this.props.Auction.endTime ? (
                        !this.props.Auction.ended ? (
                          <button
                          className="btn btn-outline-success mt-4 w-50"
                          style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                          onClick={ () => {
                            this.props.NFTContract.methods.endAuction(this.props.NFT.tokenID).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                              window.location.reload();
                            });
                          }}
                          >
                            End
                          </button>
                        ) : (
                          <botton
                          className="btn btn-outline-danger mt-4 w-50"
                          style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                          >
                              Waiting for claimed
                          </botton>
                        )
                        
                      ) : (
                        <button
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                      >
                        Not Ended
                      </button>
                      )}
                      </div>
                    ) : (
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
                    )}
                  </div>
        )
    }
}

export default MyTokenInfo;