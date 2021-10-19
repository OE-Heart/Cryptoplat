const NFTAuction = artifacts.require("NFTAuction");

module.exports = function(deployer) {
  deployer.deploy(NFTAuction);
};