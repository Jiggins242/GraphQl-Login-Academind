const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = { 
    
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
// Creates and saves the information to the DB for an event
    createEvent: async (args, req) => {
        // Checks to see if we are authenticated to allow us to create an event
        if (!req.isAuth){
            throw new Error('Unauthenticated!')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            // We get the user ID from the token in the request now
            creator: req.userId
        })
            let createdEvent
            try {
            const result = await event
            .save()
                createdEvent = transformEvent(result)
                // We get the user ID from the token in the request now
                const creator = await User.findById(req.userId)
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
    }
};