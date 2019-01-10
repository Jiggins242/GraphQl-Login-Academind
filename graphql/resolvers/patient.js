const Patient = require('../../models/patient')
const { transformPatient } = require('./merge')


module.exports = { 
// Root query  for returning all Patient information 
    patients: async (args, req) => {
        // Checks to see if we are authenticated to allow us to create an event
        if (!req.isAuth){
            throw new Error('Unauthenticated!')
        }
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

// Creates and saves the information to the DB for an patient
// to allow the grpahql to save to the databsae 
    createPatient: async (args, req) => {
        // Checks to see if we are authenticated to allow us to create an event
        if (!req.isAuth){
            throw new Error('Unauthenticated!')
        }
        const patient = new Patient({
            // we take the argument added for title, from the patientinput query 
            title: args.patientInput.title,
            forname: args.patientInput.forname,
            surname: args.patientInput.surname,
            age: args.patientInput.age,
            // We get the user ID from the token in the request now
            creator: req.userId
        })
            let createdPatient
            try {
            const result = await patient
            .save()
            // spread operator (...), allows core documents from mongoose 
            createdPatient = transformPatient(result)
            // We get the user ID from the token in the request now
            const creator = await User.findById(req.userId)
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
    }
}