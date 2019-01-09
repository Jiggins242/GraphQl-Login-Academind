const authResolver = require('./auth')
const patientResolver = require('./patient')
const eventResolver = require('./event')
const bookingResolver = require('./booking')

const rootResolver ={
    ...authResolver,
    ...patientResolver,
    ...eventResolver,
    ...bookingResolver
}

module.exports = rootResolver