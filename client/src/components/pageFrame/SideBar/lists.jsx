import { DashboardOutlined, LanOutlined, ElectricMeterOutlined, DevicesOutlined, KeyboardArrowDown, KeyboardArrowLeft, Thunderstorm, TrendingDown, AccountBox, ExitToApp } from "@mui/icons-material";
import { useState } from "react";
import Inverter from '../../../assets/inverter.svg?react';
import ProtectionRelay from '../../../assets/protectionRelay.svg?react';
import WeatherStation from '../../../assets/weatherStation.svg?react';
import SLD from '../../../assets/SLD.svg?react';
import AlarmButton from "./alarmButton";

const list = [
    {
        text: {
            en: 'control panel',
            ar: 'لوحة التحكم',
            de: 'Steuerungspanel',
            fr: 'Panneau de commande',
        },
        pageName: "control-panel",
        element: ({ key, text, lang, page = '', setPage }) => {
            console.log('-------', page);
            return (
                <li className={`sidebar-li ${page === "control-panel" ? "chosen" : ""}`} key={key} onClick={() => setPage('control-panel')} >
                    <DashboardOutlined />
                    {text[lang]}
                </li>
            )
        },
    },
    {
        text: {
            en: 'Network Overview',
            ar: 'نظرة عامة على الشبكة',
            de: 'Übersicht über das Netzwerk',
            fr: 'Aperçu du réseau',
        },
        pageName: "network-overview",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            return (
                <li className={`sidebar-li ${page === "network-overview" ? "chosen" : ""}`}
                    key={key} onClick={() => {
                        if (page === "network-overview") return;
                        setPage('network-overview')
                    }}
                >
                    <LanOutlined />
                    {text[lang]}
                </li>
            )
        },
    },

    {
        text: {
            en: "Single Line Diagram",
            ar: 'مخطط المحطة'
        },
        pageName: "single-line-diagram",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            return (
                <li className={`sidebar-li ${page === "single-line-diagram" ? "chosen" : ""}`}
                    key={key} onClick={() => {
                        if (page === "single-line-diagram") return;
                        setPage('single-line-diagram')
                    }}
                >
                    <SLD style={{ width: '1em', height: '1em', aspectRatio: '1', fontSize: '1.5rem' }} />
                    {text[lang]}
                </li>
            )
        },
    },
    {
        text: {
            en: 'Devices',
            ar: 'الأجهزة',
            de: 'Geräteliste',
            fr: 'Liste des appareils',
        },
        pageName: "devices-list",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            const [isDevicesListOpen, setIsDevicesListOpen] = useState(false);
            let pageSect = page.split('/')[0]
            let subpage = page.split('/')[1]
            const deviceList = [
                { text: { en: 'Energy Meter', ar: 'عداد الكهرباء' }, pageName: "en-meter", icon: <ElectricMeterOutlined /> },
                { text: { en: 'Inverter', ar: 'الإنفرتر' }, pageName: "inverter", icon: <Inverter style={{ width: '1em', height: '1em', aspectRatio: '1', fontSize: '1.5rem' }} /> },
                { text: { en: 'Protection Relay', ar: 'ريلاي الوقاية' }, pageName: "protection-relay", icon: <ProtectionRelay style={{ width: '1em', height: '1em', aspectRatio: '1', fontSize: '1.5rem' }} /> },
                { text: { en: 'Weather Station', ar: 'محطة الأرصاد' }, pageName: "weather-station", icon: <WeatherStation style={{ width: '1em', height: '1em', aspectRatio: '1', fontSize: '1.5rem', fill: 'currentcolor' }} /> },
            ]
            return (
                <li key={key} >
                    <div className={`sidebar-li ${pageSect === "devices-list" ? "chosen" : ""}`}
                        onClick={(e) => {
                            if (e.target.closest('.sidebar-arrow')) return;
                            if (page !== "devices-list") {
                                setPage('devices-list');
                            } else {
                                setPage('devices-list');
                            }

                        }}
                        style={{
                            justifyContent: "space-between",
                            display: 'flex',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <DevicesOutlined />
                            {text[lang]}
                        </div>
                        <div className="sidebar-arrow" onClick={(e) => {
                            setIsDevicesListOpen(!isDevicesListOpen);
                        }}  >
                            {/* <span style={{ color: 'red', fontSize: '1.5rem' }}>+</span> */}
                            <KeyboardArrowLeft style={{ transform: (isDevicesListOpen) ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>
                    </div>
                    <div style={{
                        display: (isDevicesListOpen) ? 'flex' : 'none',
                        paddingInlineStart: '20px',
                    }}>
                        <ul style={{
                            listStyle: 'none',
                            padding: '0',
                            margin: '0',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%'

                        }}>
                            {deviceList.map((device, index) => (
                                <li key={index} className={`sidebar-li sublist ${subpage === device.pageName ? "chosen" : ""}`}
                                    onClick={() => {
                                        if (pageSect === "devices-list" && subpage === device.pageName) {
                                            setPage("devices-list")
                                            return;
                                        }
                                        setPage(`devices-list/${device.pageName}`)
                                    }} >
                                    {device.icon}
                                    {device.text[lang]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            )
        },
    },
    {
        text: { en: 'Alarm List', ar: 'الإنذارات' },
        pageName: "alarm-list",
        element: ({ key, text, lang, page, setPage }) => <AlarmButton className={`sidebar-li ${page === "alarm-list" ? "chosen" : ""}`} key={key} text={text} lang={lang} page={page} setPage={setPage} onClick={() => { setPage('alarm-list') }} />,

    },
    {
        text: {
            en: "Trends",
            ar: 'الرسوم البيانية',
            de: 'Trends',
            fr: 'Tendances',
        },
        pageName: "trends",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            return (
                <li className={`sidebar-li ${page === "trends" ? "chosen" : ""}`}
                    key={key} onClick={() => {
                        if (page === "trends") return;
                        setPage('trends')
                    }}
                >
                    <TrendingDown />
                    {text[lang]}
                </li>
            )
        },
    },

]

const userList = [
    {
        text: {
            en: "User Settings",
            ar: "إعدادات المستخدم",
        },
        pageName: "user-settings",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            return (
                <li className={`sidebar-li ${page === "user-setting" ? "chosen" : ""}`}
                    key={key} onClick={() => {
                        if (page === "user-setting") return;
                        setPage('user-setting')
                    }}
                >
                    <AccountBox />
                    {text[lang]}
                </li>
            )
        },


    },
    {
        text: {
            en: "Log out",
            ar: "تسجيل الخروج",
        },
        pageName: "log-out",
        element: ({ key = null, text, lang, page = '', setPage }) => {
            return (
                <li
                    key={key} onClick={() => {
                        localStorage.removeItem("token")
                    }}
                >
                    <a href="/login" className={`sidebar-li`} style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer'
                    }}>
                        <ExitToApp />
                        {text[lang]}
                    </a>
                </li>
            )
        },
    }
]

export { list, userList }