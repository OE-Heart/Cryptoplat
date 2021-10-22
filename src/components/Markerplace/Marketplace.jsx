import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";

const Marketplace = ({
    NFTs,
    accountAddress,
    NFTNum,
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (NFTs.length !== 0) {
            if (NFTs[0].metaData !== undefined) {
                setLoading(loading);
            }
            else {
                setLoading(false);
            }
        }
    }, [NFTs]);

    return (
        <div>
            <div className="card mt-1">
                <div className="card-body align-items-center d-flex justify-content-center">
                    <h5>
                        Total number of NFTs on the platform : {NFTNum}
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Marketplace;