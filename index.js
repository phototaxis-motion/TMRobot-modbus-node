var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const TCP_IP = "169.254.68.61"
const TCP_PORT = 502
const DATA_ADDRESS = 7013
const DATA_ADDRESS_LENGTH = 12
const DEFAULT_RESPONSE = [ 14560, 0 , 47262 , 45056, 14594 , 39936, 47592, 57344, 14290, 8192, 14709 ,58368 ] // Degree: [0,0,0,0,0,0]
let CACHE_RESPONSE = [0,0,0,0,0,0]

// Logger TCP
// open connection to a tcp line
client.connectTCP(TCP_IP, { port: TCP_PORT });
client.setID(1);
// set timeout, if slave did not reply back
client.setTimeout(500);

// Express
const express = require('express')
const app = express()
const port = 3000
console.log("Start Express App.")
let deltaSec = 0
const convertDWord = (data) => {
  const buf = Buffer.from(
    data.map((int => {
      const str16 = int.toString(16).padStart(4, '0')
      return [
        parseInt(str16.slice(0,2), 16),
        parseInt(str16.slice(2,4), 16)
      ]
    })).flat()
  )
  return [
    buf.readFloatBE(0),
    buf.readFloatBE(4),
    buf.readFloatBE(8),
    buf.readFloatBE(12),
    buf.readFloatBE(16),
    buf.readFloatBE(20),
  ]
}


// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
// readHoldingRegisters(dataAddress: number, length: number): Promise
const getTCPData = async (reconnect = false) => {
  try {
    // const { data = [] } = await client.readHoldingRegisters(0, 10)
    const { data = DEFAULT_RESPONSE, buffer } = await client.readInputRegisters(DATA_ADDRESS, DATA_ADDRESS_LENGTH)
    // return CACHE_RESPONSE = convertDWord(data)
    return [
      buffer.readFloatBE(0),
      buffer.readFloatBE(4),
      buffer.readFloatBE(8),
      buffer.readFloatBE(12),
      buffer.readFloatBE(16),
      buffer.readFloatBE(20),
    ]
  } catch(e) {
    console.log(`0: ${e.name}: ${e.message}`)
    if (reconnect) { // 防止頻傳打發生的斷線
      client.connectTCP(TCP_IP, { port: TCP_PORT });
      client.setID(1);
      return await getTCPData(false)
    }
    return CACHE_RESPONSE
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