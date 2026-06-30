import { EventEmitter } from "events"
import net from 'net'

const IEC104_CMDs = {
    STARTDT: 0x07,
    STARTDT_CON: 0x0B,
    STOPDT: 0x13,
    STOPDT_CON: 0x23,
    TESTFR: 0x43,
    TESTFR_CON: 0x83,
}

class IEC104 extends EventEmitter {
    constructor(networkConfig = { host: 'localhost', port: 2404, type: 'client' }) {
        super();
        this.networkConfig = networkConfig;
        this.socket = new net.Socket();
        this.N_S = 0;
        this.N_R = 0;
        this.w = 8;
        this.k = 12;
        this.t1 = { timer: null, val: 15 };
        this.t2 = { timer: null, val: 10 };
        this.t3 = { timer: null, val: 23 };
        this.unackedPackets = 0;

        this.socket.on('connect', () => {
            console.log('connect')
            // 
        });

        this.socket.on('data', (data) => {
            console.log('data', data)//
            /**
             * parse IEC104 packet from server
             * if data[0] != 0x68, it is not a valid IEC104 packet
             */
            if (data[0] != 0x68) return;
            /**
             * if APDU_len too short (< 4 ), return
             */
            let APDU_len = data[1];
            if (APDU_len < 4) return;

            let control_fields = data.subarray(2, 4)
            /**
             * packets are sorted according to control_fields[0]
             * if control_fields[0] & 0x03 == 0x00, then it is I-format
             * if control_fields[0] & 0x03 == 0x01, then it is S-format
             * if control_fields[0] & 0x03 == 0x02, then it is U-format
             * 
             */
            let packetFormat = control_fields[0] & 0x03;
            // t3 clear
            clearTimeout(this.t3.timer);
            this.t3.timer = setTimeout(() => {
                console.log("------")
                this.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.TESTFR, 0x00, 0x00, 0x00]));
                clearTimeout(this.t3.timer);
            }, this.t3.val * 1000);
            switch (packetFormat) {
                case 0:
                case 2:
                    this.parseIFormat(data.subarray(2));
                    break;
                case 1:

                    this.parseSFormat(control_fields);
                    break;
                case 3:
                    this.parseUFormat(control_fields);
                    break;
                default:
                    break;
            }

        });

        this.socket.on('error', (err) => {
            console.log('error', err)
        });

        this.socket.on('close', () => {
            console.log('close')
        });

    }

    start() {
        this.socket.connect(this.networkConfig.port, this.networkConfig.host);
    }

    stop() {
        this.socket.end();
    }

    sendData(buffer) {
        this.socket.write(buffer);
    }

    parseIFormat(data) {
        console.log("formatted", data);
        this.N_R = data[0] / 2 + data[1] * 128;
        this.N_S = data[2] / 2 + data[3] * 128;
        this.N_R++;
        console.log(this.N_R);
        let ASDU_format = data.subarray(4);

        this.unackedPackets++;

        this.emit('I-format', ASDU_format);
        if (this.unackedPackets >= this.w) {
            this.sendSFormat();

        } else {
            if (!this.t2.timer) {
                this.t2.timer = setTimeout(() => {

                    this.sendSFormat();
                }, this.t2.val * 1000)
            }
        }

    }

    parseSFormat(data) {
        this.N_S = data[2] / 2 + data[3] * 128;
        this.sendSFormat();
    }

    sendSFormat() {
        clearTimeout(this.t2.timer)
        this.t2.timer = null;
        this.unackedPackets = 0;
        let dat0 = (this.N_R & 0xff) << 1;
        let dat1 = ((this.N_R >> 8) & 0xFF) << 1;
        this.sendData(
            Buffer.from(
                [0x68, 0x04, 0x01, 0x00, dat0, dat1]
            )
        )
    }

    parseUFormat(data) {
        switch (data[0]) {
            case IEC104_CMDs.STARTDT:
                this.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.STARTDT_CON, 0x00, 0x00, 0x00]));
                break;
            case IEC104_CMDs.STARTDT_CON:
                console.log('STARTDT_CON')
                // it is acknowledged of STARTDT, we can start to send data
                break;
            case IEC104_CMDs.STOPDT:
                this.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.STOPDT_CON, 0x00, 0x00, 0x00]));
                break;
            case IEC104_CMDs.STOPDT_CON:
                // it is ack of STOPDT, we can stop to send data
                break;
            case IEC104_CMDs.TESTFR:
                this.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.TESTFR_CON, 0x00, 0x00, 0x00]));
                break;
            case IEC104_CMDs.TESTFR_CON:
                // it is acknowledge for TESTFR, we can continue to send data
                break;
            default:
                // packet error
                break;
        }
    }

}



export { IEC104, IEC104_CMDs }