const mongoose = require('mongoose')

const Schema = mongoose.Schema
// is the schema for the DB, needs to be the same as the grpahql query to stop errors and mistakes for eventInput
const eventSchema = new Schema ({
    title: {
         type: String,
         required: true
         },
    description: {
        type: String,
        required: true
        },
    price: {
        type: Number,
        required: true
        },
    date: {
        type: Date,
        required: true
        },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Event',eventSchema)