const validUrl = require('valid-url')
const moment = require('moment')
const Record = require('../models/record.model')

class RecordService {
  validate(model) {
    if (!model) throw Error('Bad request')
    if (!model.url || !validUrl.isWebUri(model.url)) throw Error('URL provided is not a valid')
    switch (typeof model.expires) {
      case 'number':
      case 'string':
        throw new Error('Expires must be undeclared or { d?:number, h?:number, m?:number, s?:number }')
    }
  }

  async create(model) {
    const record = new Record({
      url: model.url.trim(),
      expires: this.convertDate(model.expires)
    })

    await record.save()
    return record
  }

  async getById(id) {
    if (!id) throw Error('No id provided')
    try {
      return await Record.findOne({ id })
    } catch (err) {
      throw Error('No record found')
    }
  }

  async getUrl(id) {
    try {
      console.log(new Date())
      return (await Record.findOneAndUpdate({
        id,
        expires: {
          $gte: new Date()
        }
      }, {
        $inc: {
          viewed: 1
        }
      })).url
    } catch (err) {
      return null
    }
  }

  convertDate(futureModel) {
    const {
      d,
      h,
      m,
      s
    } = futureModel || {
      d: 30
    }
    const min = moment().add(30, 'seconds')
    const max = moment().add(30, 'days')
    const future = moment()
      .add(d || 0, 'days')
      .add(h || 0, 'hours')
      .add(m || 0, 'minutes')
      .add(s || 0, 'seconds')

    if (future.isBefore(min)) return new Date(min.valueOf())
    else if (future.isAfter(max)) return new Date(max.valueOf())
    return new Date(future.valueOf())
  }
}

module.exports = RecordService
