import AlarmIcon from '../../../assets/alarm.svg?react'
import { useRef, useEffect } from 'react'

function AlarmButton({ mykey, props, text, lang, notificationsCount = 0, onClick = () => { }, className }) {
    const alarmRef = useRef(null);
    useEffect(() => {
        if (alarmRef.current) {
            // alarmRef.current.style.color = "red";
            let notification = alarmRef.current.querySelector('.alarm-with-notification');
            if (notificationsCount > 0) {
                notification.style.display = "block";
                notification.querySelector(".text-notification tspan").textContent = notificationsCount;
            } else {
                alarmRef.current.style.color = "white";
                notification.style.display = "none";

            }
        }
    }, [notificationsCount]);
    return (
        <li key={mykey} className={className} {...props} onClick={onClick}>
            <AlarmIcon ref={alarmRef} style={{ height: '1em', width: '1em', fontSize: '1.5rem' }} />
            <div>
                {text[lang]}
            </div>
        </li>
    )
}

export default AlarmButton;