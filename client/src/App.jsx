import { useState, useEffect, useCallback } from 'react'
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
  const [isLoading, setIsLoading] = useState(false);




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
    let timeout = null;


    if (!isSocketConnected) {
      timeout = setTimeout(() => {
        //setIsLoading(true);
        clearTimeout(timeout);
      }, 2000);
    }
    if (isSocketConnected) {
      socket.emit("page", { clientId: socket.id, page });
      return;
    };
    const mysocket = io("ws://192.168.1.230:8500");

    mysocket.on("connect", () => {
      console.log("Connected to server", mysocket.id);
      setSocket(mysocket);
      setIsSocketConnected(true);

      mysocket.on("data-exchange", (data) => {
        database = { ...database, ...data };
        console.log(database);
      })
    });



    mysocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      if (isSocketConnected) mysocket.disconnect();
      clearTimeout(timeout);
    };

  }, [page, isSocketConnected]);




  const pages = [
    <Overview dir={dir} cardsData={cardsData} />,
    <Network />,
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
          {!isLoading ? <h2> {{ en: "loading", ar: "جاري التحميل" }[dir.lang]} </h2> : (() => {
            console.log('page', page)
            switch (page) {
              case 0:
                return <Overview dir={dir} cardsData={cardsData} />
              case 1:
                return <Network />
              default:
                return <h1>2</h1>
            }
          })()}
        </div>

      </MainPage>
    </>
  )
}

export default App
