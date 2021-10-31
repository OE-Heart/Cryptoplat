import React from "react";
import { HashRouter, Route } from "react-router-dom";
import './App.css';
import Web3 from "web3";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Metamask from "./components/Metamask";
import NoContract from "./components/NoContract";
import Loading from "./components/Loading/Loading";
import Marketplace from "./components/Markerplace/Marketplace";
import Create from "./components/Create/Create";
import Queries from "./components/Queries/Queries";
import MyTokens from "./components/MyTokens/MyTokens"

import NFTAuction from "./build/contracts/NFTAuction.json";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAddress: "",
            accountBalance: "",
            NFTContract: null,
            NFTCount: 0,
            NFTs: [],
            loading: true,
            metamaskConnected: false,
            contractDetected: false,
            NFTNumOfAccount: 0,
            nameIsUsed: false,
            lastMintTime: null,
            Auctions: [],
            currentTime: null,
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillMount = async () => {
        await this.loadWeb3();
        await this.loadBlockChain();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick = async() => {
        if (this.state.NFTContract) {
            let currentTime = await this.state.NFTContract.methods.getTime().call();
            console.log("time:", currentTime);
            this.setState({currentTime});
        }
    }

    loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask.");
        }
    }

    loadBlockChain = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) 
            this.setState({metamaskConnected: false});
        else {
            this.setState({metamaskConnected: true});
            this.setState({loading: true});
            this.setState({accountAddress: accounts[0]});
            
            let balance = await web3.eth.getBalance(accounts[0]);
            balance = web3.utils.fromWei(balance, "ether");
            this.setState({accountBalance: balance});
            this.setState({loading: false});

            const netID = await web3.eth.net.getId();
            const netData = NFTAuction.networks[netID];
            if (netData) {
                this.setState({loading: true});
                const NFTContract = new web3.eth.Contract(
                    NFTAuction.abi,
                    netData.address
                );
                this.setState({NFTContract});
                this.setState({contractDetected: true});
                
                const NFTCount = await NFTContract.methods.NFTCounter().call();
                this.setState({NFTCount});

                for (let i = 1; i <= NFTCount; i++) {
                    const nft = await NFTContract.methods.allNFTs(i).call();
                    this.setState({NFTs: [...this.state.NFTs, nft],});
                    const auction = await NFTContract.methods.AuctionsOfNFT(i).call();
                    this.setState({Auctions: [...this.state.Auctions, auction],})
                }

                let NFTNumOfAccount = await NFTContract.methods.getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress).call();
                this.setState({NFTNumOfAccount});
                this.setState({loading: false});
            }
        }
    }

    connectToMetamask = async () => {
        await window.ethereum.enable();
        this.setState({metamaskConnected: true});
        window.location.reload();
    }

    render() {
        return (
            <div>
            {
                !this.state.metamaskConnected ? (
                    <Metamask connectToMetamask={this.connectToMetamask}/>
                ) : ! this.state.contractDetected ? (
                    <NoContract/>
                ) : this.state.loading ? (
                    <Loading/>
                ) : (
                    <HashRouter basename="/">
                    <Navbar />
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Home
                                accountAddress={this.state.accountAddress}
                                accountBalance={this.state.accountBalance}
                            />
                        )}
                    />
                    <Route
                        path="/marketplace"
                        exact
                        render={() => (
                            <Marketplace 
                                accountAddress={this.state.accountAddress}
                                NFTs={this.state.NFTs}
                                NFTCount={this.state.NFTCount}
                                NFTContract={this.state.NFTContract}
                                Auctions={this.state.Auctions}
                            />
                        )}
                    />
                    <Route
                        path="/create"
                        exact
                        render={() => (
                            <Create
                                accountAddress={this.state.accountAddress}
                                NFTContract={this.state.NFTContract}
                            />
                        )}
                    />
                    <Route
                        path="/my-tokens"
                        exact
                        render={() => (
                            <MyTokens
                                accountAddress={this.state.accountAddress}
                                NFTs={this.state.NFTs}
                                NFTNumOfAccount={this.state.NFTNumOfAccount}
                                NFTContract={this.state.NFTContract}
                                Auctions={this.state.Auctions}
                                currentTime={this.state.currentTime}
                            />
                        )}
                    />
                    <Route
                        path="/my-auctions"
                        exact
                        render={() => (
                            <div>My Auctions</div>
                        )}
                    />
                    <Route
                        path="/queries"
                        exact
                        render={() => (
                            <Queries
                            accountAddress={this.state.accountAddress}
                            NFTs={this.state.NFTs}
                            NFTCount={this.state.NFTCount}
                            NFTContract={this.state.NFTContract}
                            Auctions={this.state.Auctions}
                            />
                        )}
                    />
                </HashRouter>
                )
            }
            </div>
        )
    }
}

export default App;