import { useEffect, useRef, useState } from "react";
import {
    OverlayScrollbarsComponent
} from 'overlayscrollbars-react';
import "overlayscrollbars/overlayscrollbars.css";
import './PageNavBar.css'

function PageNavBar({ language }) {
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [optionIndex, setOptionIndex] = useState(0);
    const optionRef = useRef(null);


    const energyMeterList = [
        {
            id: 1,
            name: {
                en: 'Energy meter 1',
                ar: 'عداد الكهرباء 1'
            },
            status: 'online',
        },
        {
            id: 2,
            name: {
                en: 'Energy meter 2',
                ar: 'عداد الكهرباء 2'
            },
            status: 'offline',
        },
        {
            id: 3,
            name: {
                en: 'Energy meter 3',
                ar: 'عداد الكهرباء 3'
            },
            status: 'online',
        },
        {
            id: 4,
            name: {
                en: 'Energy meter 4',
                ar: 'عداد الكهرباء 4'
            },
            status: 'offline',
        },
        {
            id: 5,
            name: {
                en: 'Energy meter 5',
                ar: 'عداد الكهرباء 5'
            },
            status: 'online',
        },
        {
            id: 6,
            name: {
                en: 'Energy meter 6',
                ar: 'عداد الكهرباء 6'
            },
            status: 'offline',
        },
        {
            id: 7,
            name: {
                en: 'Energy meter 7',
                ar: 'عداد الكهرباء 7'
            },
            status: 'online',
        },
        {
            id: 8,
            name: {
                en: 'Energy meter 8',
                ar: 'عداد الكهرباء 8'
            },
            status: 'offline',
        },
        {
            id: 9,
            name: {
                en: 'Energy meter 9',
                ar: 'عداد الكهرباء 9'
            },
            status: 'online',
        },
        {
            id: 10,
            name: {
                en: 'Energy meter 10',
                ar: 'عداد الكهرباء 10'
            },
            status: 'offline',
        },
        {
            id: 11,
            name: {
                en: 'Energy meter 11',
                ar: 'عداد الكهرباء 11'
            },
            status: 'online',
        },
        {
            id: 12,
            name: {
                en: 'Energy meter 12',
                ar: 'عداد الكهرباء 12'
            },
            status: 'offline',
        },
        {
            id: 13,
            name: {
                en: 'Energy meter 13',
                ar: 'عداد الكهرباء 13'
            },
            status: 'online',
        },
        {
            id: 14,
            name: {
                en: 'Energy meter 14',
                ar: 'عداد الكهرباء 14'
            },
            status: 'offline',
        },
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionRef.current && !optionRef.current.contains(event.target)) {
                setOptionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [optionRef]);


    return (
        <div ref={optionRef} className="scroll-container" onClick={() => setOptionsOpen(!optionsOpen)} style={{
            width: '200px',
            position: 'relative'
        }}>
            <div className="nav-option-item" style={{ backgroundColor: 'rgba(25, 20, 119, 1)' }}>
                <div className={`status-part ${energyMeterList[optionIndex].status}`}>

                </div>
                <div className="text-part">
                    {energyMeterList[optionIndex].name[language.lang] || energyMeterList[optionIndex].name.en}
                </div>

            </div>
            <div style={{
                position: 'absolute',
                width: '100%',
                display: optionsOpen ? 'block' : 'none',
                zIndex: '999'
            }}>
                <OverlayScrollbarsComponent className="options-list" options={{
                    overflow: {
                        x: "hidden",
                        y: "scroll"
                    },
                    scrollbars: {
                        autoHide: "move",
                        autoHideDelay: 1000,
                        theme: "os-theme-dark",
                        dragScroll: true,
                        clickScroll: true
                    }
                }} style={{
                    maxHeight: '300px',
                    width: '100%'
                }}>
                    {energyMeterList.map((item, i) => {
                        return (
                            <div className={`nav-option-item ${i === optionIndex ? 'active' : ''}`} onClick={() => setOptionIndex(i)}>
                                <div className={`status-part ${item.status}`}>

                                </div>
                                <div className="text-part">
                                    {item.name[language.lang] || item.name.en}
                                </div>

                            </div>
                        )
                    })}
                </OverlayScrollbarsComponent>
            </div>
        </div>

    );
}

//
export default PageNavBar;