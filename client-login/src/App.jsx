import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { ip, socketPort, webServerPort } from './config.js';
import LangButton from './utilities/LangButton.jsx'

const passwordValidationList = [
  { en: "Password must be at least 8 characters long", ar: "يجب أن تكون كلمة المرور 8 أحرف على الأقل" },
  { en: "Password must contain at least one uppercase letter", ar: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" },
  { en: "Password must contain at least one lowercase letter", ar: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل" },
  { en: "Password must contain at least one number", ar: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" },
  { en: "Password must contain at least one special character", ar: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل" },
]

const usernamePlaceHolder = { en: "Username", ar: "اسم المستخدم" }
const passwordPlaceHolder = { en: "Password", ar: "كلمة المرور" }
const loginButtonText = { en: "Login", ar: "تسجيل الدخول" }

const pageTitle = { en: "Login", ar: "تسجيل الدخول" }

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState([false, false, false, false, false]);
  let languageSettings = window.localStorage.getItem('language') ? JSON.parse(window.localStorage.getItem('language')) : { lang: 'en', dir: 'ltr' };
  const [lang, setLang] = useState(languageSettings);
  const [isWrong, setIsWrong] = useState(false);

  document.title = pageTitle[lang.lang] || pageTitle['en'];

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
      color: 'white',
      direction: lang.dir,
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
        width: '350px'
      }}
      >
        <h1>
          {
            ((lang) => {
              let titles = {
                en: "Login to SCADA",
                ar: "تسجيل الدخول"
              }
              return titles[lang.lang] || titles[en]
            })(lang)
          }
        </h1>
        <form action={`http://${ip}${webServerPort == 80 ? '' : ':' + webServerPort}/api/login`} method="POST" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          width: "100%",
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            width: "100%",
          }}>
            <input type="text" name="username" placeholder={usernamePlaceHolder[lang.lang] || usernamePlaceHolder['en']} style={{
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
            width: "100%",
          }}>
            <input style={{
              width: "100%",
            }} type="password" name="password" placeholder={passwordPlaceHolder[lang.lang] || passwordPlaceHolder['en']}
              onChange={(e) => {
                setPassword(e.target.value);
                // check all the conditions
                setPasswordValidation([
                  e.target.value.length >= 8 ? true : false,
                  /[A-Z]/.test(e.target.value) ? true : false,
                  /[a-z]/.test(e.target.value) ? true : false,
                  /[0-9]/.test(e.target.value) ? true : false,
                  /[^A-Za-z0-9]/.test(e.target.value) ? true : false,
                ])
              }} value={password}
            />
            <ol style={{

            }} className='password-instructions'>
              {passwordValidation.map((item, index) => (
                <li key={index} style={{
                  opacity: !item && !isWrong ? 0.2 : 1,
                  color: item ? 'green' : isWrong ? 'red' : 'white',
                }} className={item ? 'achieved' : ''}>
                  <span className='symbol'> {item ? '✓' : isWrong ? '✗' : ''} </span>
                  <span className='password-instruction-text'> {passwordValidationList[index][lang.lang] || passwordValidationList[index]['en']} </span>
                </li>
              ))}
            </ol>

          </div>
          <button type="submit" style={{}}
            onClick={(e) => {
              e.preventDefault();
              console.log(username, password)
              setIsWrong(true);
              fetch(`http://${ip}${webServerPort == 80 ? '' : ':' + webServerPort}/api/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              })
                .then(res => {
                  console.log(res)
                  if (res.ok || res.redirected) {
                    window.location.href = '/main';
                  } else {
                    setIsWrong(true);
                  }
                })

            }}
          >{loginButtonText[lang.lang] || loginButtonText['en']}</button>
        </form>
      </div>

      <div style={{
        position: 'absolute',
        top: '10px',
        right: lang.dir === 'ltr' ? '10px' : 'auto',
        left: lang.dir === 'rtl' ? '10px' : 'auto',

      }}>
        <LangButton lang={lang} setDir={setLang} />
      </div>

    </div >
  )
}

export default App
