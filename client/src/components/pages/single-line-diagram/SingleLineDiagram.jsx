import SLD from '../../../assets/single-line-diagram.svg?react';
import { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import SLD_Cell from './SingleLineDiagramFcn'
import './SingleLineDiagram.css'

function SingleLineDiagram() {
    const containerRef = useRef(null);
    const [timeoutId, setTimeoutId] = useState(null);
    const phaseRef = useRef(1);
    const dummyVals = useRef({
        pr_01: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_02: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_06: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_09: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_13: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_14: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        pr_07: {
            begin: 128,
            buffer: new ArrayBuffer(100)
        },
        em_01: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        em_02: {
            begin: 9200,
            buffer: new ArrayBuffer(100)
        },
        em_06: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        em_09: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        em_13: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        em_14: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        em_07: {
            begin: 9000,
            buffer: new ArrayBuffer(100)
        },
        devices_state: new ArrayBuffer(15),
        controls_state: new ArrayBuffer(15)

    })
    useEffect(() => {
        console.log(containerRef.current.querySelector(".cell-containter-1"))
        const sld1 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-1"), dummyVals, 1, phaseRef);
        const sld2 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-2"), dummyVals, 2, phaseRef);
        const sld6 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-6"), dummyVals, 6, phaseRef);
        const sld9 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-9"), dummyVals, 9, phaseRef);
        const sld13 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-13"), dummyVals, 13, phaseRef);
        const sld14 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-14"), dummyVals, 14, phaseRef);
        const sld7 = new SLD_Cell(containerRef.current.querySelector(".cell-containter-7"), dummyVals, 7, phaseRef);
        let num = setInterval(() => {
            let keys = [1, 2, 6, 9, 13, 14, 7]
            for (let j = 0; j < keys.length; j++) {
                let i = keys[j]
                let key_pr = `pr_${i.toString().padStart(2, '0')}`;
                let key_em = `em_${i.toString().padStart(2, '0')}`;
                //console.log(dummyVals.current[`pr_${i.toString().padStart(2, '0')}`]);
                const prArr = new Uint8Array(dummyVals.current[key_pr].buffer);
                for (let k = 0; k < prArr.length; k++) {
                    prArr[k] = Math.floor(Math.random() * 255);
                }
                //console.log(dummyVals.current[`em_${i.toString().padStart(2, '0')}`]);
                const emArr = new Uint8Array(dummyVals.current[key_em].buffer);
                for (let k = 0; k < emArr.length; k++) {
                    emArr[k] = Math.floor(Math.random() * 255);
                }
            }
            const devicesStateArr = new Uint8Array(dummyVals.current.devices_state);
            for (let i = 0; i < devicesStateArr.length; i++) {
                devicesStateArr[i] = Math.floor(Math.random() * 255);
            }


            SLD_Cell.updateAll();

        }, 1000);
        return () => {
            clearInterval(num);
        }
    }, []);
    return (
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={100}
            step={0.005}
            limitToBounds={true}

        >
            <TransformComponent contentStyle={{
                placeContent: 'center',
                height: '100%',
                width: 'fit-content',
                margin: '0 auto',
                padding: '10px',
                boxSizing: 'border-box'
            }} wrapperStyle={{
                height: '100%',
                width: 'fit-content',
                margin: '0 auto',
                placeContent: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
            }}>
                <div ref={containerRef} className="container" style={{ height: '100%' }}>
                    <SLD ref={containerRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
}

export default SingleLineDiagram;

/*

*/

/*
 if (svg) {
                containerRef.current.querySelector('.volt-value').textContent = ((Math.random() * 200) + 6500).toString().slice(0, 6)
                const line11 = svg.querySelector('.line-1-1');
                const line12 = svg.querySelector('.line-1-2');
                const line13 = svg.querySelector('.line-1-3');
                const contact1 = svg.querySelector('.contact-1');
                const rect = svg.querySelector('.contact-1-rect')

                const line21 = svg.querySelector('.line-2-1');
                const line22 = svg.querySelector('.line-2-2');
                const line23 = svg.querySelector('.line-2-3');
                const contact2 = svg.querySelector('.contact-2');
                if (rand1) {
                    line11.setAttribute('d', 'm 78.284144,113.17293 -12.693251,0')
                    line12.setAttribute('d', 'm 77.775932,114.56923 -12.185039,0')
                    line13.setAttribute('d', 'm 78.030038,113.87108 10.154062,0')
                    contact1.setAttribute('transform', `rotate(20,79.399261,110.10917)`)
                    rect.style.fill = 'red'

                } else {
                    line11.setAttribute('d', 'M 79.399261,113.17293H 65.590893')
                    line12.setAttribute('d', 'M 79.399261,114.56923H 65.590893')
                    line13.setAttribute('d', 'M 79.399261,113.87108H 88.1841')
                    contact1.setAttribute('transform', `rotate(0,79.399261,110.10917)`)
                    rect.style.fill = '#338000'
                }

                if (rand2) {
                    line21.setAttribute('d', 'm 87.485951 97.326577 0 -4.985291')
                    line22.setAttribute('d', 'm 88.882251 97.834789 0 -5.493503')
                    line23.setAttribute('d', 'M 88.1841 97.580682 V 113.87108')
                    contact2.setAttribute('transform', `rotate(20,84.42218,96.211464)`)

                } else {
                    line21.setAttribute('d', 'm 87.485951 96.211456 v -3.87017')
                    line22.setAttribute('d', 'm 88.882251 96.211456 v -3.87017')
                    line23.setAttribute('d', 'M 88.1841 96.211455 V 113.87108')
                    contact2.setAttribute('transform', `rotate(0,84.42218,96.211464)`)
                }
            }
                */