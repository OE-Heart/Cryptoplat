import React from 'react';
import ReactDOM from 'react-router-dom';
import {create} from 'ipfs-http-client';

let ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NFTName: "",
            ipfsHash: '',
            buffer: null,  //Data to be sent to ipfs
        }
    }

    chooseFile = (event) => {
        event.preventDefault();
        let file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({buffer: Buffer(reader.result)});
            console.log('buffer', this.state.buffer);
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting file to IPFS");

        ipfs.add(this.state.buffer, (err, result) =>{
            console.log('ipfs result', result);
            const ipfsHash = result[0].hash;
            this.setState({ipfsHash});
            if (err) {
                console.log(err);
                return;
            }
        })
    }

    render() {
        return (
            <div>
            <div className="jumbotron">
                <h1 className="display-5">Create your NFT</h1>
            </div>
            <form onSubmit={this.onSubmit}>
                <input type="file" onChange={this.chooseFile}/>
                <input type="submit" value="Submit"/>
                <input
                  required
                  type="text"
                  value={this.state.NFTName}
                  className="form-control"
                  placeholder="Enter Your NFT's Name"
                  onChange={(e) =>
                    this.setState({ NFTName: e.target.value })
                  }
                />
            </form>
            <form onSubmit={(event) => {
                event.preventDefault();
                let price = document.getElementById("p").value;
                this.props.NFTContract.methods.mintNFT(this.state.NFTName, this.state.ipfsHash, price).send({from: this.props.accountAddress});
            }}>
            </form>
            </div>
        )
    };
}

export default Create;