
import NetworkSVG from "../../../assets/network.svg?react";
import { useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Network.css'

import { io } from "socket.io-client";

function Network({ socket }) {
    const svgRef = useRef(null);
    useEffect(() => {
        socket.current.on("page-2", (data) => {
            console.log(data);
        })
    }, []);
    return (
        <TransformWrapper
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
        </TransformWrapper>
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