import { useState, useEffect, useCallback, useRef, useReducer } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Login from './components/pages/login/login'
import MainPage from './components/pageFrame/MainPage'
import Overview from './components/pages/overview/Overview'
import Network from './components/pages/network/Network'
import { io } from 'socket.io-client';
import { ip, socketPort, webServerPort } from './config.js';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

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
    "EM002": { startFrom: 0, length: 100, buffer: new Uint16Array(100) }

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


  useEffect(() => {
    let mysocket = io(`ws://${ip}:${socketPort}`);
    mysocket.on("connect", () => {
      console.log("Connected to server", mysocket.id, ' timestamp', new Date().toLocaleTimeString());
      mysocket.emit("page", [
        { deviceID: ["LOG001", "EM003"], startFrom: 8, length: 1 },
      ]);
      mysocket.on("data-exchange", (data) => {
        console.log("main socket recieves");
      });
    });


    return () => {
      console.log('Network unloaded')
      mysocket.disconnect();
    }
  }, [])



  const pages = {
    "main/control-panel": <Overview dir={dir} cardsData={cardsData} socket={socketRef} refreshincCbk={refreshingCbk} />,
    "main/network-overview": <Network setLastData={setLastData} dir={dir} socket={socketRef} refreshincCbk={refreshingCbk} buffRef={DBRef} />,
    "main/single-line-diagram": <h1>2</h1>,
    "main/3": <h1>3</h1>,
    "main/devices-list/inverter": <h1>4</h1>,
    "main/5": <h1>5</h1>,
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
