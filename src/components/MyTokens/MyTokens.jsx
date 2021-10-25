import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";

const MyTokens = ({
    accountAddress,
    NFTs,
    NFTNumOfAccount,
    NFTContract,
  }) => {
    const [loading, setLoading] = useState(false);
    const [myNFTs, setMyNFTs] = useState([]);
  
    useEffect(() => {
      if (NFTs.length !== 0) {
        if (NFTs[0].metaData !== undefined) {
          setLoading(loading);
        } else {
          setLoading(false);
        }
      }
      const myNFTs = NFTs.filter(
        (NFT) => NFT.currentOwner === accountAddress
      );
      setMyNFTs(myNFTs);
    }, [NFTs]);
  
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>
              Total number of NFTs You Own : {NFTNumOfAccount}
            </h5>
          </div>
        </div>
        <div className="d-flex flex-wrap mb-2">
          {myNFTs.map((NFT) => {
            return (
              <div
                key={NFT.tokenID}
                className="w-50 p-4 mt-1 border"
              >
                <div className="row">
                  <img src={NFT.tokenURI} id="preview_img" width="150px" height="200px" alt=""/>
                  <div className="col-md-6 text-center">
                    <div key={NFT.tokenID} className="mt-4 ml-3">
                      <p>
                        <span className="font-weight-bold">tokenID</span> :{" "}
                        {NFT.tokenID}
                      </p>
                      <p>
                        <span className="font-weight-bold">Name</span> :{" "}
                        {NFT.currentOwnertokenName}
                      </p>
                      <p>
                        <span className="font-weight-bold">Price</span> :{" "}
                        {window.web3.utils.fromWei(NFT.price, "Ether")} ETH
                      </p>
                      <p>
                        <span className="font-weight-bold">Number of Transfers</span>:{" "}
                        {NFT.transNum}
                      </p>
                    </div>
                    {NFT.onSale ? (
                      <div>Highest Bid</div>
                    ) : (
                      <button
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                        onClick={ () => {
                          NFTContract.methods.beginAuction(NFT.tokenID, 0, 1000).send({ from: accountAddress, gas: '3000000'}).on("confirmation", () => {
                            window.location.reload();
                          });
                        }}
                      >
                        Sale
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default MyTokens;