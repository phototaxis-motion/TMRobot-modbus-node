// TCP_IP=127.0.0.1 TCP_PORT=502 ADDRESS=0 LENGTH=10 node pingAddress
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const TCP_IP = process.env.TCP_IP || "127.0.0.1"
const TCP_PORT = process.env.TCP_IP || 502
const DATA_ADDRESS = process.env.ADDRESS || 0
const LENGTH = process.env.LENGTH || 10

console.log({
  TCP_IP,
  TCP_PORT,
  DATA_ADDRESS,
  LENGTH
})

// client.connectTCP(TCP_IP, { port: TCP_PORT });
// client.setID(1);
// client.setTimeout(500);

// client.readHoldingRegisters(DATA_ADDRESS, LENGTH).then((res)=>{
//   console.log(res)
// }, (rejectReason)=>{
//   console.log(rejectReason)
// })