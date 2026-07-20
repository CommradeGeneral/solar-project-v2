import { useState, useEffect, useCallback, useRef, useReducer } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Login from './components/pages/login/login'
import MainPage from './components/pageFrame/MainPage'
import Overview from './components/pages/overview/Overview'
import Network from './components/pages/network/Network'
import PowerMeter from './components/pages/power-meter/PowerMeter'
import SingleLineDiagram from './components/pages/single-line-diagram/SingleLineDiagram.jsx'
import { io } from 'socket.io-client';
import { ip, socketPort, webServerPort } from './config.js';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import UserSetting from './components/pages/userSetting/UserSetting';

let devices = [];

let deviceSubscriptions = (device) => {

}

let deviceUnsubscriptions = (device) => {

}

function App() {
  let languageSettings = window.localStorage.getItem('language') ? JSON.parse(window.localStorage.getItem('language')) : { lang: 'en', dir: 'ltr' };
  console.log(" language settings: ", languageSettings);
  const [dir, setDir] = useState(languageSettings);
  const [page, setPage] = useState('control-panel');
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  const refreshingCbk = useRef(null);

  const DBRef = useRef({
    "EM001": { startFrom: 0, length: 100, buffer: new Uint16Array(100) },
    "EM002": { startFrom: 0, length: 100, buffer: new Uint16Array(100) },

  });
  const [lastData, setLastData] = useState(null);
  const cardsData = [
    {
      title: { en: 'CSS1 - East Wing', ar: 'CSS1 - الجناح الشرقي' },
      desc: { en: 'East Wing - Main Distribution Center', ar: 'المركز الرئيسي لتوزيع الطاقة' },
      inverters: 15,
      powerMeters: 0,
      EnergrM: 0,
      KVA: 1000,
      imgUrl: 'https://th.bing.com/th/id/OIP.KMQD-_dbilR6n8vVzEIrrgHaE7?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    },
    {
      title: { en: 'CSS2 - West Wing', ar: 'CSS2 - الجناح الغربي' },
      desc: { en: 'West Wing - Main Distribution Center', ar: 'المركز الرئيسي لتوزيع الطاقة' },
      inverters: 20,
      powerMeters: 0,
      EnergrM: 0,
      KVA: 2000,
      imgUrl: 'https://th.bing.com/th/id/OIP.KMQD-_dbilR6n8vVzEIrrgHaE7?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    },
    {
      title: { en: 'CSS1 - North Wing', ar: 'CSS1 - الجناح الشمالي' },
      desc: { en: 'North Wing - Main Distribution Center', ar: 'المركز الرئيسي لتوزيع الطاقة' },
      inverters: 15,
      powerMeters: 0,
      EnergrM: 0,
      KVA: 1000,
      imgUrl: 'https://th.bing.com/th/id/OIP.KMQD-_dbilR6n8vVzEIrrgHaE7?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    },
    {
      title: { en: 'CSS1 - South Wing', ar: 'CSS1 - الجناح الجنوبي' },
      desc: { en: 'South Wing - Main Distribution Center', ar: 'المركز الرئيسي لتوزيع الطاقة' },
      inverters: 15,
      powerMeters: 0,
      EnergrM: 0,
      KVA: 1000,
      imgUrl: 'https://th.bing.com/th/id/OIP.KMQD-_dbilR6n8vVzEIrrgHaE7?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    },
    {
      title: { en: 'CSS1 - Back Wing', ar: 'CSS1 - الجناح الخلفي' },
      desc: { en: 'Back Wing - Main Distribution Center', ar: 'المركز الرئيسي لتوزيع الطاقة' },
      inverters: 15,
      powerMeters: 0,
      EnergrM: 0,
      KVA: 1000,
      imgUrl: 'https://th.bing.com/th/id/OIP.KMQD-_dbilR6n8vVzEIrrgHaE7?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    }
  ]

  // disconnect all previous websockets before creating new one

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io(`ws://${ip}:${socketPort}`)
    const mysocket = socketRef.current

    deviceSubscriptions = (id, device) => {
      // prevent duplicate
      if (!devices.find((item) => item.id === id)) {
        devices.push({
          id: id,
          devices: device
        })
      }

      mysocket.emit("page", devices);
    }

    deviceUnsubscriptions = (id) => {
      devices = devices.filter((item) => item.id !== id);
      mysocket.emit("page", devices);
    }

    mysocket.on("connect", () => {
      console.log("Connected to server", mysocket.id, ' timestamp', new Date().toLocaleTimeString());

      deviceSubscriptions("main-page",
        [
          { deviceID: "LOG001/EM001", startFrom: 9001, length: 60 },
          { deviceID: "LOG001/EM002", startFrom: 9001, length: 60 }
        ]
      )

    });
    const handler = (e) => {
      console.log("DevicesStatues from server: ", e);
    }
    mysocket.on("devices-statues", handler);

    mysocket.on("data-exchange", (e) => {
      console.log("Data from server: ", e);
    })




    return () => {
      console.log('Network unloaded')
      mysocket.off("devices-statues", handler);
      mysocket.disconnect();
      devices = [];
    }
  }, [])



  const pages = {
    "main/control-panel": <Overview dir={dir} cardsData={cardsData} socket={socketRef} refreshincCbk={refreshingCbk} />,
    "main/network-overview": <Network setLastData={setLastData} dir={dir} socket={socketRef} refreshincCbk={refreshingCbk} buffRef={DBRef} />,
    "main/single-line-diagram": <SingleLineDiagram />,
    "main/3": <h1>3</h1>,
    "main/devices-list/inverter": <h1>4</h1>,
    "main/devices-list/energy-meter": <PowerMeter language={dir} />,
    "main/5": <h1>5</h1>,
    "main/user-setting": <UserSetting dir={dir} />,
  }
  return (
    <>
      <BrowserRouter>
        <MainPage dir={dir} setDir={setDir} page={page} setIsLoading={setIsLoading} isLoading={isLoading}>
          <div className="" style={{
            width: "100%",
            height: "100%",
            padding: '10px',
            boxSizing: 'border-box',
            placeContent: 'center'
          }}>

            <Routes>
              {
                Object.keys(pages).map((key) => (
                  <Route key={key} path={`/${key}`} element={pages[key]} />
                ))
              }
              <Route path="/" element={<Navigate to="/control-panel" replace />} />
            </Routes>


          </div>

        </MainPage>
      </BrowserRouter>
    </>
  )
}

export default App
export { deviceSubscriptions, deviceUnsubscriptions }
