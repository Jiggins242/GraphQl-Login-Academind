// These are the mongoDB/ Mongoose schemas for the database
// These Schemas should be built in the same style of the GraphQl Schemas made but are not the same
// Is the same as the Patient Schema in GQl (../graphql/schema/index.js)
// Is the same as the Patient Schema in GQl (../graphql/schema/schema.js)
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema ({
    title: {
         type: String,
         required: true
         },
    forename: {
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
    doctorId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Patient',patientSchema)