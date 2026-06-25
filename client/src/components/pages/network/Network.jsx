
import NetworkSVG from "../../../assets/network.svg?react";
import { useRef, useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Network.css'
import { io } from "socket.io-client";
/*
[
                            { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                            { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
                        ]
*/

function Network({ dir, socket, refreshincCbk, buffRef, setLastData }) {
    const svgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const effectcbk = async () => {
        console.log('Network loaded')
        let sock = io("ws://192.168.1.230:8500");
        sock.on("connect", () => {
            console.log("Connected to server", sock.id);
            sock.emit("page", [
                { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
            ]);
            sock.on("data-exchange", (data) => {
                if (!loaded) setLoaded(true)

                let buff = new Uint16Array(data.buff)
                console.log('buff => ', buff[0])
                console.log(data.deviceID[1], '=>', buff)
                console.log(buffRef.current[data.deviceID[1]])
                console.log(data)
                for (let i = 0; i < buff.length; i++) {
                    buffRef.current[data.deviceID[1]].buffer[i + data.startFrom] = buff[i];
                }
                let val = buffRef.current["EM001"].buffer[3]
                //svgRef.current.querySelector('.' + `pr-01`).classList.add('online')

                for (let i = 1; i <= 14; i++) {
                    if ((val & (1 << (i - 1))) != 0) {
                        svgRef.current.querySelector('.' + `pr-${i.toString().padStart(2, '0')}`).classList.add('online');
                        svgRef.current.querySelector('.signal-' + `pr-${i.toString().padStart(2, '0')}`).classList.add('online');
                    } else {
                        svgRef.current.querySelector('.' + `pr-${i.toString().padStart(2, '0')}`).classList.remove('online');
                        svgRef.current.querySelector('.signal-' + `pr-${i.toString().padStart(2, '0')}`).classList.remove('online');

                    }
                }
            });
        });

        sock.on("disconnect", () => {
            console.log("Disconnected from server");
            setLoaded(false)
        });
        return () => {
            console.log('Network unloaded')
            sock.disconnect();
            setLoaded(false)
        }
    }

    useEffect(() => {
        effectcbk()
    }, [])
    return (
        loaded ? <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={100}
            step={0.005}
            limitToBounds={true}
            disablePanOnZoom={true}
        // don't move if svg is smaller than the screen

        >
            <TransformComponent contentStyle={{
                height: "100%",
                width: '100%',
                margin: '0 auto'
            }}
                wrapperStyle={{
                    height: "100%",
                    width: '100%',
                    placeContent: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}
            >
                <Content svgRef={svgRef} />
            </TransformComponent>
        </TransformWrapper> : <div>{(() => {
            let loading = { en: 'loading', ar: 'جار التحميل' }
            return loading[dir.lang] || loading.en
        })()}</div>
    )
}

function Content({ svgRef }) {



    useEffect(() => {
        const svg = svgRef.current;
        let intervalId = null;
        if (svg) {

        }

    }, []);
    return (
        <NetworkSVG
            ref={svgRef}
            style={{
                height: "100%",
                margin: '0 auto'
            }}
        />
    )
}

export default Network