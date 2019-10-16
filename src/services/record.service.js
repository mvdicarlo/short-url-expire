const validUrl = require('valid-url')
const bcrypt = require('bcrypt')
const moment = require('moment')
const Record = require('../models/record.model')

class RecordService {
  validate(model) {
    if (!model) throw Error('Bad request')
    if (!model.url || !validUrl.isWebUri(model.url)) throw Error('Link provided is not a valid')
    if (model.url.length > 2048) throw Error('Link is too long (max 2048)')
    if (model.expires && typeof model.expires !== 'number') throw new Error('Expires must be numeric time value')
  }

  isValidUrl(url) {
    return !!validUrl.isWebUri(url)
  }

  async create(model) {
    const record = new Record({
      url: model.url.trim(),
      expires: this.clampDate(model.expires),
      password: model.password ? await this.hashPassword(model.password) : null
    })

    await record.save()

    // sanitize return
    const rec = record.toJSON()
    delete rec.password
    return rec
  }

  async getById(id) {
    if (!id) throw Error('No id provided')
    console.log(this.retrieveIdFromString(id))
    try {
      return await Record.findOne({
        id: this.retrieveIdFromString(id)
      })
    } catch (err) {
      throw Error('No record found')
    }
  }

  async getUrl(id) {
    try {
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

  hashPassword(pw) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pw, 10, (err, hash) => {
        if (err) reject(err)
        else resolve(hash)
      })
    })
  }

  passwordsMatch(pw1, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pw1, hash, (err, res) => {
        resolve(!!res)
      })
    })
  }

  clampDate(date) {
    if (date) {
      const min = moment().add(30, 'seconds')
      const max = moment().add(60, 'days')
      const future = moment(date)

      if (future.isBefore(min)) return new Date(min.valueOf())
      else if (future.isAfter(max)) return new Date(max.valueOf())
      return new Date(future.valueOf())
    } else {
      // Default to 1 month
      return new Date(moment().add(30, 'days').valueOf())
    }
  }

  async expireUrl(expireModel) {
    if (!expireModel.password) throw new Error('No password provided')
    if (!expireModel.password.trim()) throw new Error('No password provided')
    if (!expireModel.id) throw new Error('No link or id provided')

    let id = this.retrieveIdFromString(expireModel.id)
    const record = await Record.findOne({ id })

    if (!record) throw new Error('No record found')
    if (!record.password) throw new Error('Record does not have a password for expiration')

    const matches = await this.passwordsMatch(expireModel.password.trim(), record.password)
    if (matches) {
      await Record.deleteOne({ id })
    } else {
      throw new Error('Password provided does not match')
    }
  }

  retrieveIdFromString(str) {
    return str.split('/').pop()
  }
}

module.exports = RecordService
