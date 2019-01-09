const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const Patient = require('../../models/patient')
const User = require('../../models/user')
const Booking = require('../../models/booking')

//=====================================================================================================================================================
//
const transformEvent = event => {
    return { ...event._doc,
        id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
}
//=====================================================================================================================================================
//
const transformPatient = patient => {
    return { ...patient._doc,
        id: patient.id,
        creator: user.bind(this, patient.creator)
    }
}
//=====================================================================================================================================================
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
//=====================================================================================================================================================
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
//=====================================================================================================================================================
// For all Patients 
const patients =  async patientIds => {
    try {
    const patients = await Patient.find({ _id: {$in: patientIds}})
    return patients.map(patient => {
            return transformPatient(patient)
            })
        }   
        catch(err) {
        throw err
    }
}; 
//=====================================================================================================================================================
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

module.exports = { 
//=====================================================================================================================================================
    // Root query  for returning all event information 
    events: async () => {
        try {
        // If we find we no argument we will bring back all documents in Events
        const events = await Event.find()
            // We will return all the events from the DB and make them into a new object 
            // _doc will bring back the core data and remove out the meta data 
            return events
            .map( event => {
                return transformEvent(event)
                })
            }
            catch(err) {
            // if an error
            throw err
        }
    }, 
//=====================================================================================================================================================
    // Root query  for returning all Patient information 
    patients: async () => {
        try{
        // If we find we no argument we will bring back all documents in the Patients field
        const patients = await Patient.find()
            // We will return all the events from the DB and make them into a new object 
            // _doc will bring back the core data and remove out the meta data 
            return patients
            .map( patient => {
                return transformPatient(patient)
                })
            } 
            catch(err){
            // if an error
            throw err
        }
    },
//=====================================================================================================================================================
    bookings: async () => {
        try{
            const bookings = await Booking.find()
            return bookings
            .map(booking => {
                return { ...booking._doc,
                        _id: booking.id,
                        user: user.bind(this, booking._doc.user),
                        event: singleEvent.bind(this, booking._doc.event),
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString()}
                })
            } 
            catch (err) {
            throw err
        }
    },
//=====================================================================================================================================================
// Creates and saves the information to the DB for an event
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            // Hard coped in the user for the demo 
            creator: '5c347b3d11913b3c1c5189c2'
        })
            let createdEvent
            try {
            const result = await event
            .save()
                createdEvent = transformEvent(result)
                // Hard coped in the user for the demo 
                const creator = await User.findById('5c347b3d11913b3c1c5189c2')
                if (!creator) {
                    throw new Error('User not found.')
                }
                // If found user
                // the event is updated into the createdEvents section inside the user information 
                creator.createdEvents.push(event)
                await creator.save()

                return createdEvent

            } 
            catch(err) {
            console.log(err) 
            throw err
        }
    },
//=====================================================================================================================================================
// Creates and saves the information to the DB for an patient
// to allow the grpahql to save to the databsae 
    createPatient: async args => {
        const patient = new Patient({
            // we take the argument added for title, from the patientinput query 
            title: args.patientInput.title,
            forname: args.patientInput.forname,
            surname: args.patientInput.surname,
            age: args.patientInput.age,
            // Hard coped in the user for the demo 
            creator: '5c347b3d11913b3c1c5189c2'
        })
            let createdPatient
            try {
            const result = await patient
            .save()
                // spread operator (...), allows core documents from mongoose 
                createdPatient = transformPatient(result)
                // Hard coped in the user for the demo 
                const creator = await User.findById('5c347b3d11913b3c1c5189c2')
                if (!creator) {
                    throw new Error('User not found.')
                    }
                    // If found user
                    // The event is updated into the createdEvents section inside the user information 
                    creator.createdPatients.push(patient)
                    await creator.save()

                return createdPatient

            } 
            catch(err) {
            console.log(err)
            throw err
        }
    },
//=====================================================================================================================================================
// Creates and saves the information to the DB for a User
// to allow the grpahql to save to the databsae 
    createUser: async args => {
        try {
        // Will look to see if the email is already in the DB
        // If already in the DB will error saying User already exists
        // If not, will carry on the code to create the user
        const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already.')
            }
        // the bcrypt takes in the string of the inputted password
        // it is then Salted 12 times
        // 12 is classed as a safe number of times to salt the password
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPassword
            })
        // Save the created User
        const result = await user.save()
        // password will return as null so can never be sent back even in hash form 
        return { ...result._doc, 
                password: null, 
                _id: result.id}
            } 
            catch(err) {
            throw err
        }
    },
//=====================================================================================================================================================
    bookEvent: async args => {
        const fetchedevent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
        // Hard coped in the user for the demo 
            user: '5c347b3d11913b3c1c5189c2',
            event: fetchedevent
        })
        const result = await booking.save()
        return { ...result._doc,
                _id: result.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()}
    },
//=====================================================================================================================================================
    cancelBooking: async args => {
        try{
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event 
        } 
        catch(err) {
        throw err
        }
    }
}