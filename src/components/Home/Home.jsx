import React from 'react';

const Home = ({ accountAddress, accountBalance }) => {
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-5">Cryptoplat</h1>
          <p className="lead">
            This is an NFT Auction Platform where you can mint ERC721 implemented <i>NFTs</i> and deal with them.
          </p>
          <hr className="my-4" />
          <p className="lead">Account Address :</p>
          <h4>{accountAddress}</h4>
          <p className="lead">Account Balance :</p>
          <h4>{accountBalance}</h4>
        </div>
      </div>
    );
  };

export default Home;