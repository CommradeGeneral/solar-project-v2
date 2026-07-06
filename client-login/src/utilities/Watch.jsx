import { useRef, useState, useEffect } from "react"

export default function Watch() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Africa/Addis_Ababa',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }));

        };
        update();
        ref.current = setInterval(update, 250);
        return () => clearInterval(ref.current);
    }, []);
    return (
        <div style={{ fontSize: "1rem", fontWeight: "bold", textAlign: "center" }}>
            <div>{date}</div>
            <div>{time}</div>
        </div>
    )
}