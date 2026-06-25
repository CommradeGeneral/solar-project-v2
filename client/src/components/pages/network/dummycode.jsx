/*
let tempFun = async () => {
            let interval = setInterval(() => {
                console.log('pinging..')
                if (socket.current != null) {
                    socket.current.emit("page", (() => {
                        console.log('emitting...')
                        return [
                            { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                            { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
                        ]
                    })()
                    )
                    clearInterval(interval)
                }

            }, 500)
            socket.current.emit("page", (() => {
                console.log('emitting...')
                return [
                    { deviceID: ["LOG001", "EM001"], startFrom: 1, length: 10 },
                    { deviceID: ["LOG001", "EM002"], startFrom: 5, length: 10 },
                ]
            })()
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
        tempFun();*/