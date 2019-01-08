const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    // more info can be addded later: title, jobrole, forname, surname...
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // might not be needed yet for my work
    // will connect what hs been created with the user logged in 
    createdPatients: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    createdEvents: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
})

module.exports = mongoose.model('User',userSchema)