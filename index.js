// https://github.com/yaacov/node-modbus-serial
// connectRTU(path: string, options: SerialPortOptions, next: Function): void;
// connectRTU(path: string, options: SerialPortOptions): Promise<void>;
// connectTCP(ip: string, options: TcpPortOptions, next: Function): void;
// connectTCP(ip: string, options: TcpPortOptions): Promise<void>;
// connectUDP(ip: string, options: UdpPortOptions, next: Function): void;
// connectUDP(ip: string, options: UdpPortOptions): Promise<void>;
// connectTcpRTUBuffered(ip: string, options: TcpRTUPortOptions, next: Function): void;
// connectTcpRTUBuffered(ip: string, options: TcpRTUPortOptions): Promise<void>;
// connectTelnet(ip: string, options: TelnetPortOptions, next: Function): void;
// connectTelnet(ip: string, options: TelnetPortOptions): Promise<void>;
// connectC701(ip: string, options: C701PortOptions, next: Function): void;
// connectC701(ip: string, options: C701PortOptions): Promise<void>;
// connectRTUBuffered(path: string, options: SerialPortOptions, next: Function): void;
// connectRTUBuffered(path: string, options: SerialPortOptions): Promise<void>;
// connectAsciiSerial(path: string, options: SerialPortOptions, next: Function): void;
// connectAsciiSerial(path: string, options: SerialPortOptions): Promise<void>;
// connectRTUSocket(socket: string, next: Function): void;
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const TCP_IP = "127.0.0.1"
const TCP_PORT = 502
const DEFAULT_RESPONSE = []


// Logger TCP
// open connection to a tcp line
client.connectTCP(TCP_IP, { port: TCP_PORT });
client.setID(1);
// set timeout, if slave did not reply back
client.setTimeout(500);

// ########## Archive Start ##########

// // open connection to a udp line
// client.connectUDP("127.0.0.1", { port: 8502 });
// client.setID(1);

// // Read on multiple slaves
// // open connection to a serial port
// client.connectRTUBuffered("/dev/ttyS0", { baudRate: 9600 });
// // set timeout, if slave did not reply back
// client.setTimeout(500);

// ########## Archive End ##########

// ########## Node server Start ##########
// Express
const express = require('express')
const app = express()
const port = 3000
console.log("Start Express App.")

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
// readHoldingRegisters(dataAddress: number, length: number): Promise
const getTCPData = async (reconnect = false) => {
  try {
    const { data = [] } = await client.readHoldingRegisters(0, 10)
    return data
  } catch(e) {
    console.trace("getTCPData Error")
    console.log(`${e.name}: ${e.message}`)
    if (reconnect) {
      client.connectTCP(TCP_IP, { port: TCP_PORT });
      client.setID(1);
      return await getTCPData(false)
    }
    return DEFAULT_RESPONSE
  }
}

// Add Route Listener
app.get('/', async (req, res) => {
  const value = await getTCPData(true)
  res.json({
    value
  })
})

// Add Port Listener
app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})