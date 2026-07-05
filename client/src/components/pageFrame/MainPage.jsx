import { useState, useRef, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import './MainPage.css';
import Enppi from '@/assets/Enppi.svg';
import HA from '@/assets/HA.svg';
import INFINITY from '@/assets/infinty.png';
import Watch from '../utilities/Watch';
import LangButton from '../utilities/LangButton';
import './button.css';
import NavBar from "./NavBar";
import BottomBar from "./BottomBar/BottomBar.jsx";
import SideBar from "./SideBar/SideBar.jsx";
import arrow from '@/assets/arrow.svg';

function MainPage({ children, style, dir, setDir, page, setPage, setIsLoading, isLoading }) {
    let sidebar = (window.localStorage.getItem('sideBarStatus') == 'true')
    console.log(sidebar)
    const [sideBarStatus, setSideBarStatus] = useState(sidebar);
    const [changeWidth, setChangeWidth] = useState(false);
    const [sideBarWidth, setSideBarWidth] = useState(230);
    //const [dir, setDir] = useState({ dir: 'ltr', lang: 'en' });
    const sideBar = useRef(null);
    console.log('sidebar:', sideBarStatus)
    setPage = useNavigate();

    return (
        <div className="" style={{
            height: "100vh",
            width: "100vw",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            color: 'white'
        }}>
            <div className="title" style={{
                direction: dir.dir,
                boxSizing: "border-box",
                flexShrink: 0,
                background: "linear-gradient(135deg, #0d1326 0%, #131b33 100%)",
                alignItems: "center",
                padding: '10px',
                display: 'flex',
                justifyContent: "space-between",
            }}>
                {/*<button onClick={() => {
                    setSideBarStatus(!sideBarStatus);
                }}>
                    click to toggle side bar
                </button>

                <button onClick={() => {
                    setDir(dir == "ltr" ? "rtl" : "ltr");
                }}>
                    click to toggle dir
                    ⚡ 10MW ASORC PV
                </button>*/}
                <div style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: dir.dir,
                    boxSizing: "border-box",
                    display: 'flex',
                    gap: '10px'
                }}>
                    <img src={Enppi} style={{ height: "40px" }} alt="" />
                    <img src={INFINITY} style={{ height: "40px" }} alt="" />
                </div>

                <div style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#fff"
                }}>
                    {(function () {
                        const dict = {
                            en: "⚡ 10MW ASORC PV",
                            ar: "محطة أسيوط ASORC للطاقة الشمسية بقدرة 10 ميجاواط⚡",
                            de: "⚡ 10MW ASORC PV",
                        };
                        return dict[dir.lang] || dict['en'];
                    })()}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    alignItems: "stretch"
                }}>
                    <div style={{ alignSelf: 'center' }}>
                        <Watch />
                    </div>


                    <LangButton setDir={setDir} />



                </div>
            </div>
            <div className="main-page" style={{
                backgroundColor: '#0a0e1a',
                height: "100%",
                width: "100%",
                direction: dir.dir,
                overflowX: "hidden",
                display: 'flex',
                flexWrap: 'nowrap',

            }}>

                <div className="side-bar" style={{
                    height: "100%",
                    width: sideBarStatus ? `${sideBarWidth}px` : '0px',
                    boxSizing: "border-box",
                    right: dir.dir == "rtl" ? "0px" : "initial",
                    left: dir.dir == "ltr" ? "0px" : "initial",
                    position: 'relative',
                    flexShrink: 0
                }}>
                    <div className="side-bar-content" style={{
                        width: `${sideBarWidth}px`,
                        height: '100%',
                        boxSizing: 'border-box',
                        top: '0px',
                        right: dir.dir == "ltr" ? "0px" : "initial",
                        left: dir.dir == "rtl" ? "0px" : "initial",
                        position: "absolute",
                        backgroundColor: 'rgba(0, 7, 143, 0.5)',

                    }}>

                        <SideBar lang={dir} page={page} setPage={setPage} setIsLoading={setIsLoading} isLoading={isLoading} />
                        <div style={{
                            width: '20px',
                            height: '60px',
                            background: 'rgba(2, 11, 192, 0.68)',
                            position: 'absolute',
                            borderRadius: dir.dir == 'ltr' ? '0 10px 10px 0' : '10px 0 0 10px',
                            top: '50%',
                            left: dir.dir == 'ltr' ? '100%' : 'initial',
                            right: dir.dir == 'rtl' ? '100%' : 'initial',
                            zIndex: '999',
                            transform: 'translate(-0%, -50%)',
                            placeContent: 'center',
                            textAlign: 'center',
                            verticalAlign: 'center',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white',
                            placeContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onClick={() => {
                            setSideBarStatus(!sideBarStatus);
                            window.localStorage.setItem('sideBarStatus', !sideBarStatus);
                        }}>
                            <div style={{
                                transform: sideBarStatus ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.5s',
                                position: 'absolute',
                                pointerEvents: 'none',
                                //left: dir.dir == 'rtl' ? '50%' : 'initial',
                                //right: dir.dir == 'ltr' ? '50%' : 'initial',
                                //top: '50%',
                            }}>
                                <img src={arrow} alt="arrow" style={{
                                    display: 'block',
                                    width: '0.6rem',
                                    pointerEvents: 'none',
                                    transform: dir.dir == 'rtl' ? 'rotate(180deg)' : 'rotate(0deg)',
                                }} />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="work-area" style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}>




                    <div className="" style={{
                        width: "100%",
                        height: "100%",
                        padding: '10px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflowY: 'hidden'
                    }}>
                        <BottomBar lang={dir} />

                        <div style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                        }}>


                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default MainPage