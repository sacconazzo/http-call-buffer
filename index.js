const service = function (call, name, refreshTime, log) {
  this.name = name
  this._call = call
  this._refresh = refreshTime || 1000 * 60 * 5
  this._log = log
  this._data = null
  this._time = 0
  this._loading = false

  this._setLoading = function (on) {
    this._loading = on ? new Date().getTime() : null
  }

  this._readyToLoad = function (cb) {
    const now = new Date()
    const diff = now.getTime() - this._time
    const timeout = now.getTime() - this._loading
    if (
      (!this._loading && diff > this._refresh) || //check buffer expired
      (this._loading && timeout > 1000 * 60) //check loading timeout
    ) {
      if (this._log) console.log(`refreshing ${this.name}...`)
      cb(now, diff, timeout)
    }
  }

  this._getRemote = async function () {
    this._setLoading(true)
    let data = null
    try {
      data = await this._call()
    } catch (err) {}
    this._setLoading(false)
    if (data) {
      this._data = data
      this._time = new Date().getTime()
      return data
    }
  }

  this.call = async function () {
    if (this._data) {
      this._readyToLoad((now, diff) => {
        this._getRemote().then(() => {
          if (this._log) console.log(`Refresh ${this.name} after ${diff}ms: ${now.toString()}`)
        }) //refresh buffer
      })
      return this._data //return buffer
    } else {
      return await this._getRemote() //if not yet been loaded
    }
  }

  this.call().then(() => {
    if (this._log) console.log(`Linkd ${name}`)
  }) //load buffer
}

exports = module.exports = service

//export default service
