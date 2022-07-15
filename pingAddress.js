// TCP_IP=127.0.0.1 TCP_PORT=502 ADDRESS=0 LENGTH=10 node pingAddress
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const TCP_IP = process.env.IP || "127.0.0.1"
const TCP_PORT = process.env.PORT || 502
const DATA_ADDRESS = process.env.ADDRESS || 0
const LENGTH = process.env.LENGTH || 10

console.log({
  TCP_IP,
  TCP_PORT,
  DATA_ADDRESS,
  LENGTH
})

client.connectTCP(TCP_IP, { port: TCP_PORT });
client.setID(1);
client.setTimeout(500);

setTimeout(() => {
  client.readHoldingRegisters(0, 10).then((res)=>{
    console.log(res)
  }, (rejectReason)=>{
    console.log("Error")
    console.log(rejectReason)
    process.exit(1);
  })
}, 100);
