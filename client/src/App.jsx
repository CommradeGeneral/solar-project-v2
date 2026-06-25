import { useState, useEffect, useCallback, useRef, useReducer } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Login from './components/pages/login/login'
import MainPage from './components/pageFrame/MainPage'
import Overview from './components/pages/overview/Overview'
import Network from './components/pages/network/Network'

import { io } from "socket.io-client";

let database = {};

function App() {
  const [dir, setDir] = useState({ lang: 'en', dir: 'ltr' });
  const [page, setPage] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketRef = useRef(null);

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
    if (isSocketConnected) {
      //socket.emit("page", { clientId: socket.id, page: page });
      return;
    };
    let mysocket = io("ws://192.168.100.13:3000");

    mysocket.on("connect", () => {
      console.log("Connected to server", mysocket.id, ' timestamp', new Date().toLocaleTimeString());
      setSocket(mysocket);
      setIsSocketConnected(true);
      let count = 0;
      // mysocket.on("refresh", (data) => {
      console.log('page: ', page);
      console.log(lastData)
      if (lastData != null)
        mysocket.emit("page", lastData);
      //})
      if (refresgincCbk.current) {
        refresgincCbk.current();
      }
      //socket.emit("page", { clientId: socket.id, page: page });

      /*mysocket.on("data-exchange", (data) => {
        database = { ...database, ...data };
      })*/
    });



    mysocket.on("data-exchange", (data) => {
      //DBRef.current[data.deviceID].buffer.set(data.buff, data.startFrom);
      //modify DBRef.current[data.deviceID].buffer with data in range [data.startFrom, data.startFrom + data.length]
      const uint16buff = new Uint16Array(data.buff);
      for (let i = 0; i < data.length; i++) {
        // convert databuf into UINT16
        DBRef.current[data.deviceID[1]].buffer[i + data.startFrom] = uint16buff[i];
      }
      console.log(data.deviceID[1], ':', DBRef.current)
      //console.log(data);
      //console.log("data", DBRef.current);
      if (refresgincCbk.current) {
        refresgincCbk.current();
      }
    })



    mysocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socketRef.current = mysocket;

    return () => {
      if (isSocketConnected) mysocket.disconnect();
    };

  }, [page, isSocketConnected]);




  const pages = [
    <Overview dir={dir} cardsData={cardsData} socket={socketRef} refreshincCbk={refresgincCbk} />,
    <Network setLastData={setLastData} key={rand} dir={dir} socket={socketRef} refreshincCbk={refresgincCbk} buffRef={DBRef} />,
    <h1>2</h1>,
    <h1>3</h1>,
    <h1>4</h1>,
    <h1>5</h1>,
  ]
  return (
    <>
      <MainPage dir={dir} setDir={setDir} page={page} setPage={setPage} setIsLoading={setIsLoading} isLoading={isLoading}>
        <div className="" style={{
          width: "100%",
          height: "100%",
          padding: '10px',
          boxSizing: 'border-box',
          placeContent: 'center'
        }}>
          {pages[page]}
        </div>

      </MainPage>
    </>
  )
}

export default App
