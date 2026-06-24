import MainCards from "../../utilities/MainCard";
import { useEffect, useState } from "react";

function Overview({ dir, cardsData, socket }) {

    useEffect(() => {
        if (socket.current) {
            console.log("overview socket")
            socket.current.emit("page", [
                { deviceID: "EM001", startFrom: 0, length: 10 },
                { deviceID: "EM002", startFrom: 0, length: 10 },
                { deviceID: "EM003", startFrom: 0, length: 10 },
            ])
        }

    }, [])

    return (
        <div className="" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            justifyItems: 'center',
            alignItems: 'center',
            overflowY: "auto",
            height: "100%",
            width: '100%',
            gap: '20px',

        }}>
            {cardsData.map((card, index) => (
                <MainCards card={card} key={index} lang={dir.lang} />
            ))}
        </div>
    )
}

export default Overview;