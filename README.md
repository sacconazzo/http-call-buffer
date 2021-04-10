# http-call-buffer

Buffering result from Http call (or any Promises), updating only when needed.

## Why

If you need to call an external API more times but you do not want to overload the API server.

You can execute Service more times. Service makes one single call each 5 minutes (default, you can change it), and returns a buffer.
If you do not execute Service, it not makes calls to server.

Service is faster. When You execute Service, it first returns a buffer, then performs the buffer update later.

## Installation

```npm
npm -i http-call-buffer
```

## Example

Calling the same service each second. Service buffers the result and returns it. Service updates buffer after 10 seconds (each 10 seconds if needed).

```js
const Buffer = require("http-call-buffer")

//Any Promise functions allowed
const call = async () => {
  const response = await fetch("http://worldtimeapi.org/api/ip")
  return await response.json()
}

//optional
const options = {
  name: "TimeStampBuffer",
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
```

## Refs

https://www.npmjs.com/package/http-call-buffer
