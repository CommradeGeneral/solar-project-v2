import SLD from '../../../assets/single-line-diagram.svg?react';
import { useRef, useState, useEffect } from 'react';
function SingleLineDiagram() {
    const containerRef = useRef(null);
    const [timeoutId, setTimeoutId] = useState(null);
    useEffect(() => {
        const timeoutId = setInterval(() => {
            const svg = containerRef.current.querySelector('.cell');
            let rand = Math.random() > 0.5 ? true : false;

            if (svg) {
                const line11 = svg.querySelector('.line-1-1');
                const line12 = svg.querySelector('.line-1-2');
                const line13 = svg.querySelector('.line-1-3');
                const contact1 = svg.querySelector('.contact-1');
                const rect = svg.querySelector('.contact-1-rect')
                if (rand) {
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
            }
        }, 200);
        return () => clearInterval(timeoutId);
    }, []);
    return (
        <div ref={containerRef} className="container">
            <SLD />
        </div>
    );
}

export default SingleLineDiagram;