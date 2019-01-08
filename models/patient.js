const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema ({
    title: {
         type: String,
         required: true
         },
    forname: {
        type: String,
        required: true
        },
    surname: {
        type: String,
        required: true
        },
    age: {
        type: Number,
        required: true
        },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
})

module.exports = mongoose.model('Patient',patientSchema)