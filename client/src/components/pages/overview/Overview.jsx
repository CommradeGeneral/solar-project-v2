import MainCards from "../../utilities/MainCard";
import { useEffect, useState } from "react";

function Overview({ dir, cardsData, socket, refreshincCbk }) {
    useEffect(() => {
        refreshincCbk.current = () => { }
        /*if (socket.current)
            socket.current.emit("page", [
                { deviceID: ["LOG001", "EM002"], startFrom: 0, length: 3 },
                { deviceID: ["LOG001", "EM004"], startFrom: 1, length: 1 },
            ])*/
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