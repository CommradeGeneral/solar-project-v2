import { registeredSockets } from "../websocket/websocket.js";
import ModBusDevices from "../database.js";
import ModbusClient from "../../connections/modbus.js";
import { mysocket } from "../websocket/websocket.js";


ModBusDevices.forEach(device => {
    let readMemoryArea;

    if (device.RtuDevices) {
        // Multi-drop RS-485 gateway: flatten all sub-device areas into one list.
        readMemoryArea = device.RtuDevices.flatMap(rtu =>
            rtu.areas.map(area => ({
                deviceName: `${device.name}/${rtu.name}`,
                slaveID: rtu.slaveID,
                functionCode: area.fc,
                start: area.start,
                size: area.len
            }))
        );
    } else {
        // Direct Modbus TCP device.
        readMemoryArea = device.areas.map(area => ({
            deviceName: device.name,
            slaveID: device.slaveID,
            functionCode: area.fc,
            start: area.start,
            size: area.len
        }));
    }

    device.client = new ModbusClient({
        host: device.ip,
        port: parseInt(device.port),
        deviceName: device.name,
        readMemoryArea,
        loopDelay: 200,
        reconnectDelay: 3000,
        maxReconnectDelay: 3000,
        maxReadSize: 120
    });

    //console.log(device.client.areaPartition())

    device.client.on('connect', () => console.log(`[${device.name}] connected`));
    //device.client.on('close', () => console.log(`[${device.name}] connection closed`));
    device.client.on('error', (err) => {
        //console.log(`[${device.name}] error:`, err.message)
    });
    device.client.on('data', (d) => {
        //console.log(device.name, ":", d)
    },)

    device.client.on('data-fetched', (e) => {
        // filter sockets based on e.devicenNme
        registeredSockets.forEach(socket => {
            socket.devices.forEach(device => {
                if (device.deviceID === e.deviceName) {

                    let isWithinRange = false
                    console.log("device.startFrom", device.startFrom, "e.start", e.memoryStart, "device.length", device.length, "e.length", e.quantity)

                    // make sure intersection of [device.startfrom , e.startfrom+e.length-1] and [e.memorystart , e.memorystart+e.quantity-1] is not empty
                    if (Math.max(device.startFrom, e.memoryStart) <= Math.min(device.startFrom + device.length, e.memoryStart + e.quantity)) {
                        // send data to socket
                        socket.socket.emit("data-exchange", e)
                    }
                }
            })
        })
    })
    //device.client.on('timeout', () => console.log(`[${device.name}] timeout`));
    //device.client.on('reconnecting', ({ delay }) => console.log(`[${device.name}] reconnecting in ${delay}ms`));
});


setInterval(() => {
    let count = 0;

    mysocket.emit("devices-statues", {
        devices: ModbusClient.ALL_DEVICES.map(device => ({
            name: device.name,
            status: device.status
        }))
    })

}, 1000)