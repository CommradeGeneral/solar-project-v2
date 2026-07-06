import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { ip, socketPort, webServerPort } from './config.js';
import LangButton from './utilities/LangButton.jsx'

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState([
    { text: "Password must be at least 8 characters long", status: false },
    { text: "Password must contain at least one uppercase letter", status: false },
    { text: "Password must contain at least one lowercase letter", status: false },
    { text: "Password must contain at least one number", status: false },
    { text: "Password must contain at least one special character", status: false },
  ]);
  let languageSettings = window.localStorage.getItem('language') ? JSON.parse(window.localStorage.getItem('language')) : { lang: 'en', dir: 'ltr' };
  const [lang, setLang] = useState(languageSettings);


  const [isWrong, setIsWrong] = useState(false);
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(6, 0, 96, 1)',
      margin: '0',
      boxSizing: 'border-box',
      color: 'white'
    }}>

      <div style={{
        backgroundColor: 'rgba(0, 8, 119, 0.62)',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

      }}
      >
        <h1> Login to SCADA </h1>
        <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',


        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            width: "100%",
          }}>
            <input type="text" placeholder='Username' style={{
              width: "100%",
            }}
              onChange={(e) => {
                setUsername(e.target.value);
              }} value={username} />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <input type="password" placeholder='Password'
              onChange={(e) => {
                setPassword(e.target.value);
                // check all the conditions
                setPasswordValidation([
                  { text: "Password must be at least 8 characters long", status: e.target.value.length >= 8 ? true : false },
                  { text: "Password must contain at least one uppercase letter", status: /[A-Z]/.test(e.target.value) ? true : false },
                  { text: "Password must contain at least one lowercase letter", status: /[a-z]/.test(e.target.value) ? true : false },
                  { text: "Password must contain at least one number", status: /[0-9]/.test(e.target.value) ? true : false },
                  { text: "Password must contain at least one special character", status: /[^A-Za-z0-9]/.test(e.target.value) ? true : false },
                ])
              }} value={password}
            />
            <ol style={{

            }} className='password-instructions'>
              {passwordValidation.map((item, index) => (
                <li key={index} style={{
                  opacity: !item.status && !isWrong ? 0.2 : 1,
                  color: item.status ? 'green' : isWrong ? 'red' : 'white',
                }} className={item.status ? 'achieved' : ''}>
                  <span className='symbol'> {item.status ? '✓' : isWrong ? '✗' : ''} </span>
                  <span className='password-instruction-text'> {item.text} </span>
                </li>
              ))}
            </ol>

          </div>
          <button type="submit" style={{
          }}
            onClick={(e) => {
              e.preventDefault();
              setIsWrong(true);
              // check if 
              // direct to main 
              fetch(`http://${ip}:${webServerPort}/api/login`, {
                method: "POST",
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                  }
                })

            }}
          >Login</button>
        </form>
      </div>

      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}>
        <LangButton lang={lang} setDir={setLang} />
      </div>

    </div >
  )
}

export default App
