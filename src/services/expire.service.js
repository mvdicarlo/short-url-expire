const Record = require('../models/record.model')
const moment = require('moment')

class ExpireService {
  constructor() {
    this.interval = setInterval(this.autoExpire, 60000)
  }

  async autoExpire() {
    const del = await Record.deleteMany({ expires: { $lte: new Date() }})
    console.info(`${new Date().toISOString()}: Cleanup Ran`, del)
  }
}

module.exports = ExpireService
