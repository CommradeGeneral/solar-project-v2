import { useState, useEffect } from "react"
import ReactCountryFlag from "react-country-flag"
import './LangButton.css'
function LangButton({ setDir }) {
    let index = window.localStorage.getItem('languageButtonIndex') ? Number(window.localStorage.getItem('languageButtonIndex')) : 0
    const [lang, setLang] = useState(index)
    const [listOpen, setListOpen] = useState(false)
    const Lang = [
        {
            flag: "US",
            text: "English",
            lang: "en",
            dir: "ltr"
        },
        {
            flag: "EG",
            text: "العربية",
            lang: "ar",
            dir: "rtl"
        }, /*{
            flag: "IL",
            text: "עברית",
            lang: "he",
            dir: "rtl"
        },
        {
            flag: "DE",
            text: "Deutsch",
            lang: "de",
            dir: "ltr"
        },
        {
            flag: "IL",
            text: "עברית",
            lang: "he",
            dir: "rtl"
        },
        {
            flag: "CN",
            text: "中文",
            lang: "zh",
            dir: "ltr"
        },
        {
            flag: "RU",
            text: "Русский",
            lang: "ru",
            dir: "ltr"
        },
        {
            flag: "IT",
            text: "Italiano",
            lang: "it",
            dir: "ltr"
        },
        {
            flag: "ES",
            text: "Español",
            lang: "es",
            dir: "ltr"
        },
        {
            flag: "FR",
            text: "Français",
            lang: "fr",
            dir: "ltr"
        },
        {
            flag: 'IR',
            text: 'فارسی',
            lang: 'fa',
            dir: 'rtl'
        },
        {
            flag: 'JP',
            text: '日本語',
            lang: 'ja',
            dir: 'ltr'
        },
        {
            flag: 'PT',
            text: 'Português',
            lang: 'pt',
            dir: 'ltr'
        },
        {
            flag: 'NL',
            text: 'Dutch',
            lang: 'nl',
            dir: 'ltr'
        },
        {
            flag: 'TR',
            text: 'Türkçe',
            lang: 'tr',
            dir: 'ltr'
        },
        {
            flag: 'KR',
            text: '한국어',
            lang: 'ko',
            dir: 'ltr'
        },
        {
            flag: 'PK',
            text: 'اردو',
            lang: 'ur',
            dir: 'rtl'
        },
        {
            flag: 'IN',
            text: 'हिंदी',
            lang: 'hi',
            dir: 'ltr'
        },
        {
            flag: 'VN',
            text: 'Tiếng Việt',
            lang: 'vi',
            dir: 'ltr'
        },
        {
            flag: 'UA',
            text: 'Українська',
            lang: 'uk',
            dir: 'ltr'
        },
        {
            flag: 'PL',
            text: 'Polski',
            lang: 'pl',
            dir: 'ltr'
        },*/

    ]

    useEffect(() => {
        const handleclick = (e) => {
            if (!e.target.closest('.lang-box')) {
                setListOpen(false)
            }
        }
        document.addEventListener('click', handleclick)
        return () => {
            document.removeEventListener('click', handleclick)
        }
    }, [])

    return (

        <div className="lang-box" style={{ position: 'relative', direction: 'ltr' }}>
            <div className="lang-title" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                background: 'rgba(128, 93, 93, 0.2)',
                padding: "10px",
                borderRadius: "5px",
                filter: 'opacity(0.5)',
                width: '140px'
            }} onClick={(e) => {
                setListOpen(!listOpen)
            }}>
                <ReactCountryFlag
                    countryCode={Lang[lang].flag}
                    svg
                    style={{
                        width: "30px",
                        height: "auto",
                    }}
                />
                <div>{Lang[lang].text}</div>
            </div>
            <ul className="lang-list" style={{
                width: "100%",
                position: "absolute",
                top: "120%",
                left: "0px",
                background: "blue",
                zIndex: "10",
                listStyle: "none",
                padding: "0px",
                margin: "0px",
                flexDirection: 'column',
                padding: '5px',
                boxSizing: 'border-box',
                borderRadius: '5px',
                display: listOpen ? 'flex' : 'none',
                maxHeight: '200px',
                overflowY: 'auto'
            }}>
                {Lang.map((value, key) => {
                    return (
                        <li key={key} onClick={() => {
                            setLang(key)
                            setListOpen(false)
                            setDir({ dir: value.dir, lang: value.lang })
                            window.localStorage.setItem('language', JSON.stringify({ dir: value.dir, lang: value.lang }));
                            window.localStorage.setItem('languageButtonIndex', key);
                        }} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            cursor: "pointer",
                            padding: '5px'
                        }}>
                            <ReactCountryFlag
                                countryCode={value.flag}
                                svg
                                style={{
                                    width: "30px",
                                    height: "auto",
                                }}
                            />
                            <div>{value.text}</div>
                        </li>
                    )
                })}
            </ul>
        </div>


    )
}

export default LangButton