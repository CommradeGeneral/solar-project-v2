import './NavBar.css'

import { useState } from 'react'

function NavBar() {
    const [chosen, setChosen] = useState(0);
    return (
        <div style={{
            width: '100%',
            boxSizing: 'border-box',
            maxHeight: '70%',
            overflowY: 'auto',

        }}>

            <ul className="side-bar-menu" style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                gap: '10px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {
                    Array.from({ length: 6 }).map((_, index) => (
                        <li key={index} className={chosen === index ? "chosen" : ""} onClick={() => setChosen(index)}>
                            dss dds
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default NavBar