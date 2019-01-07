const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const Event = require('./models/event')
const Patient = require('./models/patient')

const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type Patient {
            _id: ID!
            title: String!
            forname: String!
            surname: String!
            age: Int!
        }

        #
        # Input is the required input for the create Mutations
        #

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input PatientInput {
            title: String!
            forname: String!
            surname: String!
            age: Int!
        }

        type RootQuery {
            events: [Event!]!
            patients: [Patient!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createPatient(patientInput: PatientInput): Patient
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { 
// Root query  for returning all event information 
        events: () => {
            // If we find we no argument we will bring back all documents in Events
            return Event.find()
            .then( events => {
                // We will return all the events from the DB and make them into a new object 
                // _doc will bring back the core data and remove out the meta data 
                return events.map( event => {
                    return {...event._doc, _id: event._doc._id.toString()}
                })
            })
            // if an error
            .catch(err => {
                throw err
            })
        },
// Root query  for returning all Patient information 
        patients: () => {
            // If we find we no argument we will bring back all documents in the Patients field
            return Patient.find()
            .then( patients => {
                // We will return all the events from the DB and make them into a new object 
                // _doc will bring back the core data and remove out the meta data 
                return patients.map( patient => {
                    return {...patient._doc, _id: patient._doc._id.toString()}
                })
            })
            // if an error
            .catch(err => {
                throw err
            })
        },


// Creates and saves the information to the DB for an event
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save()
            .then( result => {
                console.log(result)
                return { ...result._doc}
            }).catch( err => { 
                console.log(err)
                throw err
            })

        },
// Creates and saves the information to the DB for an patient
        // to allow the grpahql to save to the databsae 
        createPatient: (args) => {
            const patient = new Patient({
                // we take the argument added for title, from the patientinput query 
                title: args.patientInput.title,
                forname: args.patientInput.forname,
                surname: args.patientInput.surname,
                age: args.patientInput.age
            })
            return patient.save()
            .then( result => {
                console.log(result)
                // spread operator (...), allows core documents from mongoose 
                return { ...result._doc}
            }).catch( err => {
                console.log(err)
                throw err
            })
        }
    },
    
    graphiql: true
    })
)

// ES6 Promise
mongoose.Promise = global.Promise;
//Connect to DB before running the test ----------------------------------------------------------------------------------------------
    // Connect to MongoDB locally
    // Use connection string '127.0.0.1:27017' instead of local host to stop auth errors
    mongoose.connect(`mongodb://127.0.0.1:27017/emisdatabase`, {useNewUrlParser: true})
    .then(() => {
        console.log('--- Connected to Database ---')
        app.listen(3000)
        console.log('--- Listening to port 3000 ---')
    }).catch(err => {
        console.log(err)
    })
    // event listener on connection open to DB. Need the error to handle incase failed to connect, listens to ever error not just once 
// -----------------------------------------------------------------------------------------------------------------------------------