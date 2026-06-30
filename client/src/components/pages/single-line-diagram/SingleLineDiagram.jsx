import SLD from '../../../assets/single-line-diagram.svg?react';
import { useRef, useState, useEffect } from 'react';
function SingleLineDiagram() {
    const containerRef = useRef(null);
    const [timeoutId, setTimeoutId] = useState(null);
    useEffect(() => {
        const timeoutId = setInterval(() => {
            const svg = containerRef.current.querySelector('.cell');
            let rand1 = Math.random() > 0.5 ? true : false;
            let rand2 = Math.random() > 0.5 ? true : false;
            if (svg) {
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
        }, 2000);
        return () => clearInterval(timeoutId);
    }, []);
    return (
        <div ref={containerRef} className="container">
            <SLD />
        </div>
    );
}

export default SingleLineDiagram;