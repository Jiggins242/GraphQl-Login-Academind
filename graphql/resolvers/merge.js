const Event = require('../../models/event')
const User = require('../../models/user')
const Patient = require('../../models/patient')
const { dateToString } = require('../../helpers/date')

// Refactored code for transforming patients
const transformPatient = patient => {
    return { ...patient._doc,
        _id: patient.id,
        creator: user.bind(this, patient.creator)
    }
};
// For all Patients 
const patients =  async patientIds => {
    try {
    const patients = await Patient.find({ _id: {$in: patientIds}})
    return patients
    .map(patient => {
            return transformPatient(patient)
            })
        }   
        catch(err) {
        throw err
    }
}; 

// We are overriding the creator object data
// To override the _id to the id that mongoose provides so we can read this call back
const user =  async userId => {
    try {
    const user = await User.findById(userId)
        // spread operator (...), allows core documents from mongoose 
        return { ...user._doc, 
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents),
                createdPatients: patients.bind(this, user._doc.createdPatients)
            }
        } catch(err){
          throw err
    }   
};

// For all events 
const events =  async eventIds => {
    try {
    const events = await Event.find({ _id: {$in: eventIds}})
        return events.map(event => {
            return transformEvent(event)
            })
        }  
        catch(err) {
        throw err
    }
}; 

// For single event
const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId)
        return transformEvent(event)
        }
        catch(err) {
        throw err
    }
};

// Refactored code for transforming events
const transformEvent = event => {
    return {...event._doc,
            _id: event.id,
            date: dateToString(event._doc.date),
            creator: user.bind(this, event.creator)
    }
};

// Refactored code for transforming bookings
const transformBooking = booking => {
    return { ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
};

exports.patient = patients
exports.transformPatient = transformPatient
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking

