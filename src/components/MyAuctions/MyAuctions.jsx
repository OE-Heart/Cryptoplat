import React, { useState, useEffect } from "react";

class MyAuctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attendAuctions: [],
            attendAuctionsNum: 5,
        };
    }

    componentWillMount = async () => {
        let attendAuctionsNum = await this.props.NFTContract.methods.attendAuctionsNum(this.props.accountAddress).call();
        this.setState({attendAuctionsNum});
        console.log("mount");
    }

    componentDidMount() {
    }

    render() {
        console.log("attendAuctionsNum: ", this.state.attendAuctionsNum);
        return (
            <div></div>
        )
    }
}

export default MyAuctions;