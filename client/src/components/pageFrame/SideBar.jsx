import { AbcOutlined, DashboardOutlined, SolarPowerOutlined, DevicesOutlined, BoltOutlined } from '@mui/icons-material'
import './SideBar.css'
import { useRef } from 'react'

const controller = new AbortController();

function SideBar({ lang, page = 0, setPage = (index) => console.log(index), setIsLoading, isLoading }) {
    const timeoutRef = useRef(null);
    const counterRef = useRef(0);
    const isPending = useRef(false);
    const list = [
        {
            icon: <DashboardOutlined />,
            text: {
                en: 'control panel',
                ar: 'لوحة التحكم',
                de: 'Steuerungspanel',
                fr: 'Panneau de commande',
            }
        },

        // network overview
        {
            icon: <DevicesOutlined />,
            text: {
                en: 'network overview',
                ar: 'نظرة عامة على الشبكة',
                de: 'Übersicht über das Netzwerk',
                fr: 'Aperçu du réseau',
            }
        },
        // single line diagram
        {
            icon: <BoltOutlined />,
            text: {
                en: 'Single Line Diagram',
                ar: 'رسم تخطيطي أحادي الخط',
                de: 'Einfachliniendiagramm',
                fr: 'Schéma unifilaire',
                he: 'דיאגרמה חד-קווית'
            }
        },

    ]
    console.log(counterRef.current);
    return (
        <div className="sidebar" style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            gap: '10px',
            padding: '10px'
        }}>
            <ul className='sidebar-ul' style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '0.9rem',
                fontWeight: 'bold',
            }}>
                {list.map((item, index) => (
                    <li key={`sidebar-li-${index}`} onClick={() => {
                        console.log("current: ", isPending.current)
                        if (isPending.current) {
                            try {
                                controller.abort('aborting');
                            } catch (e) {
                                console.log("error: ")
                            }

                        }

                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        counterRef.current++;
                        setIsLoading(false);
                        setPage(index);
                        isPending.current = true;
                        timeoutRef.current = setTimeout(() => {
                            setIsLoading(true);
                            clearTimeout(timeoutRef.current);
                            isPending.current = false;
                        }, 5000);
                        fetch('http://192.168.1.230:8000/blab', { signal: controller.signal }).then((res) => {
                            console.log(res);
                            setIsLoading(true);
                            clearTimeout(timeoutRef.current);
                        }).catch((err) => {
                            setIsLoading(true);
                            clearTimeout(timeoutRef.current);
                        }).finally(() => {
                            isPending.current = false;
                        });
                    }} className={`sidebar-li ${index == page ? 'chosen' : ''}`} style={{
                    }}>
                        {item.icon}
                        <div>{item.text[lang.lang] || item.text['en']}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SideBar