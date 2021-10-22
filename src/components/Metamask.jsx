import React from "react";

const Metamask = ({ connectToMetamask }) => {
  return (
    <div className="jumbotron">
      <h1 className="display-5">
        Cryptoplat
      </h1>
      <p className="lead">
        This is an NFT Auction Platform where you can mint your ERC721 implemented <i>NFTs</i> and deal with them.
      </p>
      <hr className="my-4" />
      <button
        onClick={connectToMetamask}
        className="btn btn-primary d-flex align-items-center"
        style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
      >
        Connect Metamask{" "}
      </button>
    </div>
  );
};

export default Metamask;
