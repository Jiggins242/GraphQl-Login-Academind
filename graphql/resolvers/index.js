const authResolver = require('./auth')
const patientResolver = require('./patient')

const rootResolver ={
    ...authResolver,
    ...patientResolver
}

module.exports = rootResolver