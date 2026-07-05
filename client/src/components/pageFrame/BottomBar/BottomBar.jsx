import { useState } from "react";
import trend from '../../../assets/trend.svg'
function BottomBar({ lang }) {
    const [show, setShow] = useState(false);
    const barColor = 'rgba(0, 6, 110)';
    return (
        <div style={{
            width: "100%",
            height: "220px",
            backgroundColor: barColor,
            position: "absolute",
            zIndex: "10",
            bottom: show ? "0%" : "-220px",
            left: "0px",
            transition: "bottom 0.5s ease-in-out"
        }}>
            <div
                onClick={() => setShow(!show)}
                style={{
                    width: '50px',
                    aspectRatio: '1/1',
                    backgroundColor: barColor,
                    position: 'absolute',
                    top: '-60px',
                    left: lang.dir == 'ltr' ? 'auto' : '10px',
                    right: lang.dir == 'ltr' ? '10px' : 'auto',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <img src={trend} style={{ width: '90%', display: 'block' }} alt="" />
            </div>
        </div>
    );
}

export default BottomBar;