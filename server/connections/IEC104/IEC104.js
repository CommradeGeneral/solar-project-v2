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
        this.socket.setMaxListeners(10);
        this.N_S = 0;
        this.N_R = 0;
        this.w = 8;
        this.k = 12;
        this.t1 = { timer: null, val: 15 };
        this.t2 = { timer: null, val: 10 };
        this.t3 = { timer: null, val: 23 };
        this.reconnectionTime = 1000;
        this.unackedPackets = 0;
        this.unackedPacketsSent = 0;
        this.connectionState = 0; // 0=> disconnected, 1=> connecting, 2=> connected, 3=> error
        this._isSending = 0;
        this.socket.on('connect', () => {
            console.log('connect')
            this.connectionState = 2;
            this.sendData(Buffer.from([0x68, 0x04, IEC104_CMDs.STARTDT, 0x00, 0x00, 0x00]));

            // 
        });

        this.socket.on('data', (data) => {
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
            if (APDU_len != data.length - 2) return;
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
            console.log('error')
            this.connectionState = 3
        });

        this.socket.setTimeout(30000)
        this.socket.on('timeout', () => {
            console.log('timeout')
        })

        this.socket.on('close', () => {
            clearTimeout(this.t3.timer)
            clearTimeout(this.t2.timer)
            clearTimeout(this.t1.timer)
            this.unackedPackets = 0;
            this.t1.timer = null
            this.t2.timer = null
            this.t3.timer = null
            console.log(`Last N(R) = ${this.N_R}, Last N(S) = ${this.N_S}, `)
            this.N_R = 0;
            this.N_S = 0;
            if (this.connectionState != 3) this.connectionState = 0;
            if (this.connectionState == 1) return;
            let interval = setTimeout(() => {
                clearTimeout(interval);
                this.start();
            }, this.reconnectionTime)
        });

    }

    start(cbk = () => { }) {
        if (this.connectionState === 2) return;
        if (this.connectionState === 1) return;
        this.connectionState = 1;
        this.socket.connect(this.networkConfig.port, this.networkConfig.host);
    }

    stop() {
        this.socket.end();
    }

    sendData(buffer, callback = () => { }) {
        this.socket.write(buffer, (e) => {
            callback()
        });
    }

    sendIFrame(buffer) {
        if (this.connectionState != 2) return;
        if (this.unackedPacketsSent >= this.k) return;
        let len = buffer.length + 4
        let dat0 = ((this.N_S & 0x7F) * 2)
        let dat1 = (((this.N_S >> 7) & 0xFF));
        let dat2 = (this.N_R & 0x7F) * 2;
        let dat3 = ((this.N_R >> 7) & 0xFF)
        let header = Buffer.from([
            0x68, len,
            dat0, dat1,
            dat2, dat3
        ])
        //console.log("sending")
        console.log("From I frame: ", this._isSending)
        if (this._isSending == 1) return;
        this._isSending = 1;
        clearTimeout(this.t2.timer)

        this.sendData(Buffer.concat([header, buffer]), (e) => {
            //console.log('I am as cool a')
            this.unackedPacketsSent++;
            this.N_S++;
            this._isSending = 0;
        })
    }

    parseIFormat(data) {
        //this.N_R = (data[0] >> 1) + data[1] * 128;
        this.N_S = (data[2] >> 1) + data[3] * 128;
        this.N_R++;
        console.log("N(S) = ", this.N_S, "N(R) = ", this.N_R);
        let ASDU_format = data.subarray(4);

        this.unackedPackets++;
        //console.log("ASDU format: ", ASDU_format)

        this.emit('I-format', ASDU_format);
        if (this.unackedPackets >= this.w) {
            //console.log("W is over")
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
        this.unackedPacketsSent = 0;
        //this.sendSFormat();
    }

    sendSFormat() {
        clearTimeout(this.t2.timer)
        this.t2.timer = null;
        this.unackedPackets = 0;
        let dat0 = (this.N_R & 0x7f) << 1;
        let dat1 = ((this.N_R >> 7) & 0xFF);
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