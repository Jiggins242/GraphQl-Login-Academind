const Event = require('../../models/event')
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
    }
};