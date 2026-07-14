
//import NetworkSVG from "../../../assets/network.svg?react";
import { useRef, useEffect, useState, memo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Network.css'
import { io } from "socket.io-client";
import { ip, socketPort, webServerPort } from '../../../config.js';
import { Sanitizer } from "@mui/icons-material";
import parse from "html-react-parser";
/*
[
                            { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                            { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
                        ]
*/
function Network({ dir, socket, refreshincCbk, buffRef, setLastData }) {
    const svgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    let NetworkSVG = <h1>hello</h1>

    useEffect(() => {
        console.log('Network loaded')
        let sock = io(`ws://${ip}:${socketPort}`);
        sock.on("connect", () => {
            console.log("Connected to server", sock.id);
            sock.emit("page", [
                { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
            ]);
            sock.on("data-exchange", (data) => {
                if (!loaded) setLoaded(true)
                console.log(data);
                //let buff = new Uint16Array(data.buff)
                // console.log('buff => ', buff[0])
                //console.log(data.deviceID[1], '=>', buff)
                //console.log(buffRef.current[data.deviceID[1]])
                //console.log(data)
                /*for (let i = 0; i < buff.length; i++) {
                    buffRef.current[data.deviceID[1]].buffer[i + data.startFrom] = buff[i];
                }*/
                //let val = buffRef.current["EM001"].buffer[3]
                //svgRef.current.querySelector('.' + `pr-01`).classList.add('online')
                if (!svgRef.current) return;
                //console.log("svg element len (text) = ", svgRef.current.querySelectorAll('text').length)
                /*for (let i = 1; i <= 14; i++) {
                    if ((val & (1 << (i - 1))) != 0) {
                        svgRef.current.querySelector('.' + `pr-${i.toString().padStart(2, '0')}`).classList.add('online');
                        svgRef.current.querySelector('.signal-' + `pr-${i.toString().padStart(2, '0')}`).classList.add('online');
                    } else {
                        svgRef.current.querySelector('.' + `pr-${i.toString().padStart(2, '0')}`).classList.remove('online');
                        svgRef.current.querySelector('.signal-' + `pr-${i.toString().padStart(2, '0')}`).classList.remove('online');

                    }
                }*/
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
    }, [])
    return (
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={100}
            step={0.005}
            limitToBounds={true}
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
                <MemorizedContent svgRef={svgRef} dir={dir} isLoading={loaded} />
            </TransformComponent>
        </TransformWrapper>

    )
}

const MemorizedContent = memo(({ svgRef, dir, isLoading }) => {

    return <Content svgRef={svgRef} dir={dir} isLoading={isLoading} />
})


function Content({ svgRef, dir, isLoading }) {
    const [svgContent, setSvgContent] = useState(null);
    useEffect(() => {
        let intervalId = null;
        let comp = null;
        fetch(`http://${ip}:${webServerPort}/gloriousFiles/network.svg`).then(
            (res) => res.text().then((d) => {
                setSvgContent(d)
                // const HTML to compoenent

            })
        );

    }, []);
    return (
        (svgContent && isLoading) ? <div
            ref={svgRef}
            className="network-svg-wrapper"
            style={{
                height: '100%',
                margin: '0 auto'
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
            : <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                fontSize: '3rem',
                color: 'currentcolor',
                fontWeight: 'bold',
            }}>
                {(() => {
                    let loading = { en: 'Loading', ar: 'جار التحميل' }
                    return loading[dir.lang] || loading.en
                })()}
            </div>
    )
}

export default Network