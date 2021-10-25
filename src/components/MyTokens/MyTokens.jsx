import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";

const MyTokens = ({
    accountAddress,
    NFTs,
    NFTNumOfAccount,
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
                  {/* TODO:Show NFT details */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default MyTokens;