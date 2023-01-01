const Buffer = require('./index.js')

//Any Promise functions allowed
const call = async () => {
  return await new Promise((response) => {
    setTimeout(() => response(new Date().getTime()), 1000)
  })
}

//optional
const options = {
  name: 'TimeStampBuffer',
  refreshTime: 1000 * 10, //default 5 minutes
  awaitRefresh: true, //default false
  showLog: true, //default false
}

const myBufferedCall = new Buffer(call, options)

async function loop() {
  console.log(await myBufferedCall.call())
  setTimeout(loop, 1000)
}
loop()
