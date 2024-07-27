const mongoose = require('mongoose')
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('connected mongodb')
        const connection = mongoose.connection
        connection.on('connected', () => { console.log('connected to database') })
        connection.on('error', (error) => { console.log('cant connect to database', error) })

    }
    catch (error) {
        console.log('something is wrong', error)
    }
}
module.exports = connectDB