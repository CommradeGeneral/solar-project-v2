import './SideBar.css'
import { list, userList } from './lists';
import { useNavigate, useLocation } from 'react-router-dom';
import userImg from '../../../assets/default-profile.svg'
import './profileIcon.css'
function SideBar({ lang, page = 0, setPage = (index) => console.log(index) }) {
    const loc = useLocation();
    const modifiedSetPage = (index) => {
        setPage('/main/' + index)
    }
    let curPage = ''
    if (loc.pathname.split('/')[2]) {
        curPage += loc.pathname.split('/')[2]
    }
    if (loc.pathname.split('/')[3] != null && loc.pathname.split('/')[3] != undefined) {
        curPage += '/' + loc.pathname.split('/')[3]
    }
    console.log(curPage)
    return (
        <div className="sidebar"

            style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                gap: '10px',
                padding: '10px',
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
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
                    item.element ? item.element({ key: index, text: item.text, lang: lang.lang, page: curPage, setPage: modifiedSetPage }) : null
                ))}
            </ul>


            <div

            >
                <div className='profile-icon' style={{
                    direction: 'ltr'
                }}

                    onClick={(e) => {
                        if (page !== "main/user") {
                            setPage('/main/user')
                        }
                    }}>
                    <img src={userImg} style={{ height: '2.0rem' }} alt="" />
                    <div style={{
                        fontWeight: 'bold',

                    }}>
                        Userman
                    </div>

                </div>
                <ul className='sidebar-ul' style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    paddingTop: '10px',
                }}>
                    {userList.map((item, index) => (
                        item.element ? item.element({ key: index, text: item.text, lang: lang.lang, page: curPage, setPage: modifiedSetPage }) : null
                    ))}
                </ul>
            </div>
        </div>
    )
}



export default SideBar