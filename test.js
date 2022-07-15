var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const TCP_IP = "127.0.0.1"
const TCP_PORT = 502

client.connectTCP(TCP_IP, { port: TCP_PORT });
client.setID(1);
// set timeout, if slave did not reply back
client.setTimeout(500);

setTimeout(()=>{
  client.readInputRegisters(7013, 12).then((res)=>{
    console.log(res)
    const buf = res.buffer
    console.log(buf)
    console.log(buf.readFloatBE(0)); 
    console.log(buf.readFloatBE(4));
    console.log(buf.readFloatBE(8));
    console.log(buf.readFloatBE(12));
    console.log(buf.readFloatBE(16));
    console.log(buf.readFloatBE(20));
    process.exit(0)
  })
},1000)