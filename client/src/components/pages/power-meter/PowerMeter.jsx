import PageNavBar from './PageNavBar';
import {
    OverlayScrollbarsComponent
} from 'overlayscrollbars-react';
import "overlayscrollbars/overlayscrollbars.css";
function PowerMeter({ language }) {
    return (
        <div style={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            boxSizing: 'border-box',
            gap: '10px',
        }}>
            <div style={{
                width: '100%',
                height: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 0px',
                borderTop: '3px solid rgba(255,255,255,0.2)',
                borderBottom: '3px solid rgba(255,255,255,0.2)',
            }}>

                <h2 style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    margin: 0,
                }}>{
                        (() => {
                            let list = { en: 'Energy Meter', ar: 'عداد الكهرباء' }
                            return list[language.lang] || list.en
                        })()
                    }
                </h2>
                <div>
                    {/* Navigation buttons for switching between different energy meter data: 1 to 14 */}
                    {/*// show only 5 buttons and they can be slided by < and  > buttons*/}

                    <PageNavBar language={language} />
                </div>
            </div>

            <div style={{
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'auto'
            }}>
                <OverlayScrollbarsComponent className="options-list" options={{
                    overflow: {
                        x: "hidden",
                        y: "scroll"
                    },
                    scrollbars: {
                        autoHide: "scroll",
                        autoHideDelay: 300,
                        theme: "os-theme-light",
                        dragScroll: true,
                        clickScroll: true
                    }
                }} style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',

                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
                        gap: '10px',
                        boxSizing: 'border-box',

                    }}>

                        {Array.from({ length: 24 }).map((_, i) => {
                            return (

                                <div className="box box-1" style={{
                                    backgroundColor: '#191477ff',
                                    color: 'white',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                }}>
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                    }}>
                                        Phase A active power
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '1.4rem',
                                        color: 'rgba(0, 98, 255, 1)',
                                        fontWeight: 'bold',
                                    }}>
                                        1.123456789  <span style={{
                                            color: 'rgba(255,255,255,0.5)',

                                        }}>kW</span>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </OverlayScrollbarsComponent>
            </div >
        </div >


    );
}

export default PowerMeter;

/*
<OverlayScrollbarsComponent className="options-list" options={{
                    overflow: {
                        x: "hidden",
                        y: "scroll"
                    },
                    scrollbars: {
                        autoHide: "move",
                        autoHideDelay: 300,
                        theme: "os-theme-light",
                        dragScroll: true,
                        clickScroll: true
                    }
                }} style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',

                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
                        gap: '10px',
                        boxSizing: 'border-box',

                    }}>

                        {Array.from({ length: 25 }).map((_, i) => {
                            return (

                                <div className="box box-1" style={{
                                    backgroundColor: '#191477ff',
                                    color: 'white',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                }}>
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                    }}>
                                        Phase A active power
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '1.4rem',
                                        color: 'rgba(0, 98, 255, 1)',
                                        fontWeight: 'bold',
                                    }}>
                                        1.123456789  <span style={{
                                            color: 'rgba(255,255,255,0.5)',

                                        }}>kW</span>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </OverlayScrollbarsComponent>
*/