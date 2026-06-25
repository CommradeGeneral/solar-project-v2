
import NetworkSVG from "../../../assets/network.svg?react";
import { useRef, useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Network.css'



function Network({ dir, socket, refreshincCbk, buffRef, setLastData }) {
    const svgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        console.log('Network loaded')
        let tempFun = async () => {
            socket.current.emit("page", [
                { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
            ])
            setLastData(
                [{ deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },]
            )
            refreshincCbk.current = () => {
                //console.log(buffRef.current);
                let svgElem = svgRef.current;


                let pr01stat = buffRef.current["EM001"].buffer?.[1];
                //console.log(pr01stat);
                if (!loaded) setLoaded(true);
                if (!svgElem) return;
                for (let i = 1; i <= 12; i++) {
                    let label = `pr-${i.toString().padStart(2, '0')}`;
                    if ((pr01stat & (1 << (i - 1))) != 0) {
                        svgElem.querySelector('.' + label).classList.add('online')
                        svgElem.querySelector('.signal-' + label).classList.add('online')
                    } else {
                        svgElem.querySelector('.' + label).classList.remove('online')
                        svgElem.querySelector('.signal-' + label).classList.remove('online')
                    }
                }

            }
        }
        tempFun();
        return () => {
        }
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