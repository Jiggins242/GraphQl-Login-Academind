
const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { transformBooking, transformEvent } = require('./merge')

module.exports = { 
    bookings: async () => {
        try{
            const bookings = await Booking.find()
            return bookings
            .map(booking => {
                return transformBooking(booking)
                })
            } 
            catch (err) {
            throw err
        }
    },

    bookEvent: async args => {
        const fetchedevent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
        // Hard coped in the user for the demo 
            user: '5c347b3d11913b3c1c5189c2',
            event: fetchedevent
        })
        const result = await booking.save()
        return transformBooking(result)
    },

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
};