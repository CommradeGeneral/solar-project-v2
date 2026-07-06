import './MainCard.css';

function MainCard({ card, lang }) {

    return (
        <div className="main-card">
            <div style={{ height: "40%" }}>
                <img className='main-card-img' src={card.imgUrl} alt="" style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }} />
            </div>
            <div className="" style={{
                padding: "10px",
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            }}>
                <h2 style={{ margin: '0' }}>{card.title[lang] || card.title['en']}</h2>
                <p style={{ margin: '0' }}>{card.desc[lang] || card.desc['en']}</p>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                }}>
                    <CardRow title="Inverters" val={card.inverters} />
                    <CardRow title="P. Meters" val={card.powerMeters} />
                    <CardRow title="Energy" val={card.EnergrM} />
                    <CardRow title="KVA" val={card.KVA} />
                </div>
                <button className="open-sld-btn"
                    onClick={() => {
                        console.log('--------')
                    }}
                    style={{
                    }}> {(() => {
                        let item = { en: "Open SLD View", ar: "عرض مخطط التوزيع" };
                        return item[lang] || item['en'];
                    })()} </button>
            </div>
        </div>
    )
}

function CardRow({ title, val }) {
    return (
        <div style={{
            display: "flex", alignItems: "center",
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            justifyContent: "space-evenly",
            aspectRatio: "1",
        }}>
            <div style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: 'rgba(0, 116, 0, 1)'
            }}>
                {val}
            </div>
            <div style={{ fontSize: "0.8em" }}>
                {title}
            </div>

        </div>
    )
}
export default MainCard