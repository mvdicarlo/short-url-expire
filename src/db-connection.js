const mongoose = require('mongoose')
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    poolSize: 10,
    reconnectTries: Infinity,
    useFindAndModify: false
  })
  .then(() => console.log('Successfully connected to database.'))
  .catch(err => {
    console.error('Error connecting to database', err)
    process.exit()
  })
