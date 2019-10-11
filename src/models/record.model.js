const shortid = require('shortid')
const mongoose = require('mongoose')
const { Schema } = mongoose

const recordSchema = new Schema({
  id: {
    type: String,
    default: shortid.generate,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  viewed: {
    type: Number,
    default: 0
  },
  expires: {
    type: Date,
    required: true
  }
})

const Record = mongoose.model('Record', recordSchema)
module.exports = Record
