const Buffer = require("./index.js")

//Any Promise functions allowed
const call = async () => {
  return await new Promise((response) => {
    setTimeout(() => response(new Date().getTime()), 1000)
  })
}

//optional (default is 5 mins)
const refreshTime = 1000 * 10 //10 seconds

const mybufferedCall = new Buffer(call, refreshTime)

async function loop() {
  console.log(await mybufferedCall.call())
  setTimeout(loop, 1000)
}
loop()
