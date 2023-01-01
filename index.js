const service = function (call, options = {}) {
  this.name = options.name || ''
  this._call = call
  this._refresh = options.refreshTime || 1000 * 60 * 5
  this._awaitRefresh = options.awaitRefresh || false
  this._log = options.showLog || false
  this._data = null
  this._time = 0
  this._loading = false

  this._setLoading = function (on) {
    this._loading = on ? new Date().getTime() : null
  }

  this._readyToLoad = function () {
    const now = new Date()
    const diff = now.getTime() - this._time
    const timeout = now.getTime() - this._loading
    if (
      (!this._loading && diff > this._refresh) || //check buffer expired
      (this._loading && timeout > 1000 * 60) //check loading timeout
    ) {
      if (this._log) console.log(`${new Date().toLocaleString()}: Refreshing ${this.name}...`)
      this._now = now
      this._diff = diff
      return true
    } else {
      return false
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
      if (this._readyToLoad()) {
        await new Promise((res) => {
          if (!this._awaitRefresh) res()
          this._getRemote().then(() => {
            if (this._log) console.log(`${new Date().toLocaleString()}: Refresh ${this.name} after ${this._diff}ms`)
            if (this._awaitRefresh) res()
          }) //refresh buffer
        })
      }
      return this._data //return buffer
    } else {
      return this._getRemote() //if not yet been loaded
    }
  }

  this.call().then((data) => {
    if (this._log) console.log(`${new Date().toLocaleString()}: Linkd ${this.name} ${!data ? '(no data)' : ''}`)
  }) //load buffer
}

exports = module.exports = service

//export default service
