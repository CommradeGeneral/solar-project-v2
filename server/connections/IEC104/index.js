import { IEC104, IEC104_CMDs } from "./IEC104.js"

const iec104 = new IEC104({
    host: 'localhost',
    port: 2404,
    type: 'client'
});

iec104.start();


setTimeout(() => {
    iec104.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.STARTDT, 0x00, 0x00, 0x00]));
    let startTime = Date.now();
    setInterval(() => {

    }, 1000)
}, 1000);
