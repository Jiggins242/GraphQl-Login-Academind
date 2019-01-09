// These are the mongoDB/ Mongoose schemas for the database
// These Schemas should be built in the same style of the GraphQl Schemas made but are not the same
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookingSchema = new Schema({
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
        { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)