import { IEC104, IEC104_CMDs } from "./IEC104.js"

const iec104 = new IEC104({
    host: 'localhost',
    port: 2404,
    type: 'client'
});

iec104.start();

setInterval(() => {
    // fire an iterrogation
    iec104.sendIFrame(Buffer.from([
        0x64, 0x01, 0x06, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x14,
    ]))
}, 1000)