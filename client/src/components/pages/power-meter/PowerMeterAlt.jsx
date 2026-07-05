
import { useEffect, useRef } from 'react'
import './BoxStyle.css'
function PowerMeterAlt({ language }) {

    const contRef = useRef(null);
    const isMouseOverRef = useRef(null);
    const Timeout = useRef(null);

    const randomColor = () => {
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    useEffect(() => {

    }, [])
    return (
        <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            flexDirection: 'column',
            display: 'flex',
            gap: '10px',
        }}>
            <div style={{
                backgroundColor: 'pink',
                width: '100%',
                height: '70px',
                flexShrink: 0
            }}></div>
            <div
                onMouseEnter={(e) => {
                    console.log('onMouseEnter');
                    //  g   et the slider element and set its height based on the scroll position


                }}

                onMouseLeave={(e) => {
                    console.log('onMouseLeave');
                    isMouseOverRef.current.style.opacity = 0;
                }}

                style={{
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: 'rgba(233, 205, 188, 0.1)',
                }}>
                <div ref={isMouseOverRef} style={{
                    position: 'absolute',
                    width: '15px',
                    height: '100%',
                    padding: '2px',
                    boxSizing: 'border-box',
                    zIndex: 1,
                    top: 0,
                    right: language.dir === 'ltr' ? 0 : 'auto',
                    left: language.dir === 'rtl' ? 0 : 'auto',
                    backgroundColor: 'rgba(65, 64, 64, 1)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                }}>
                    <div style={{
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                        boxSizing: 'content-box',
                    }}>
                        <div className="slider" style={{ width: '100%', backgroundColor: 'rgba(99, 99, 99, 1)', position: 'absolute', borderRadius: '5.5px' }}></div>
                    </div>

                </div>

                <div ref={contRef} onScroll={(e) => {
                    //  get the slider element and set its height based on the scroll position
                    const slider = isMouseOverRef.current.querySelector('.slider');
                    // using get client
                    // get clientHeight, scrollHeight, scrollTop of the scroll container
                    // getClientRect
                    isMouseOverRef.current.style.opacity = 1;
                    clearTimeout(Timeout.current);
                    Timeout.current = setTimeout(() => {
                        isMouseOverRef.current.style.opacity = 0;
                    }, 1000);

                    slider.style.height = `${contRef.current.offsetHeight * (contRef.current.offsetHeight / contRef.current.scrollHeight) - 4}px`;
                    slider.style.top = `${contRef.current.scrollTop * (contRef.current.offsetHeight / contRef.current.scrollHeight)}px`;
                    console.log('contRef.current.scrollTop', contRef.current.scrollTop);
                    console.log('contRef.current.offsetHeight', contRef.current.offsetHeight);
                    console.log('contRef.current.scrollHeight', contRef.current.scrollHeight);
                }}



                    style={{
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        boxSizing: 'border-box',
                        padding: '10px',
                        position: 'relative',
                        height: '100%',
                        // center the content
                        // background: 'linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%',
                        // background: 'linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%',
                    }}>

                    {/* top fade */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, 200px)',
                        gridGap: '10px',
                        justifyContent: 'center',
                    }}  >
                        {
                            Array.from({ length: 50 }).map((_, i) => {
                                return (
                                    <div className='card' key={i} style={{

                                    }}>
                                        <div>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>
            </div>
        </div >
    );
}

export default PowerMeterAlt;