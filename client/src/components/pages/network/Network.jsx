
//import NetworkSVG from "../../../assets/network.svg?react";
import { useRef, useEffect, useState, memo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Network.css'
import { io } from "socket.io-client";
import { ip, socketPort, webServerPort } from '../../../config.js';
import { Sanitizer } from "@mui/icons-material";
import parse from "html-react-parser";
import { deviceSubscriptions, deviceUnsubscriptions } from "../../../App.jsx";


function Network({ dir, socket, refreshincCbk, buffRef, setLastData }) {
    const svgRef = useRef(null);
    const [loaded, setLoaded] = useState(true);
    let NetworkSVG = <h1>hello</h1>

    useEffect(() => {
        console.log('Network loaded')

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
                deviceSubscriptions("network",
                    [
                        { deviceID: `LOG001/EM004`, startFrom: 9100, length: 600 },
                    ]
                )

            })
        );

        return () => {
            deviceUnsubscriptions("network")
        }

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