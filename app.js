const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Event = require('./models/event')
const Patient = require('./models/patient')
const User = require('./models/user')

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

        type User {
            _id: ID!
            username: String!
            email: String!
            password: String
            # Password can be null as we should never want to return the password from the DB to the user 
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

        input UserInput {
            username: String!
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            patients: [Patient!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createPatient(patientInput: PatientInput): Patient
            createUser(userInput: UserInput): User
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

//=====================================================================================================================================================
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

//=====================================================================================================================================================
    // Creates and saves the information to the DB for an event
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                // Hard coped in the user for the demo 
                creator: '5c347b3d11913b3c1c5189c2'
            })
            let createdEvent
            return event
            .save()
            .then( result => {
                createdEvent = {...result._doc, _id: result._doc._id.toString()}
                // Hard coped in the user for the demo 
                return User.findById('5c347b3d11913b3c1c5189c2')
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found.')
                }
                // If found user
                // the event is updated into the createdEvents section inside the user information 
                user.createdEvents.push(event)
                return user.save()
            })
            .then(result => {
                return createdEvent
            })
            .catch( err => { 
                console.log(err)
                throw err
            })

        },
//=====================================================================================================================================================
    // Creates and saves the information to the DB for an patient
    // to allow the grpahql to save to the databsae 
        createPatient: (args) => {
            const patient = new Patient({
                // we take the argument added for title, from the patientinput query 
                title: args.patientInput.title,
                forname: args.patientInput.forname,
                surname: args.patientInput.surname,
                age: args.patientInput.age,
                // Hard coped in the user for the demo 
                creator: 'Change me Change me'
            })
            let createdPatient
            return patient
            .save()
            .then( result => {
                // spread operator (...), allows core documents from mongoose 
                createdPatient = {...result._doc, _id: result._doc._id.toString()}
                // Hard coped in the user for the demo 
                return User.findById('Change me Change me')
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found.')
                    }
                    // If found user
                    // the event is updated into the createdEvents section inside the user information 
                    user.createdPatients.push(patient)
                    return user.save()
            })
            .then( result => {
                return createdPatient
            })
            .catch( err => {
                console.log(err)
                throw err
            })
        },
//=====================================================================================================================================================
    // Creates and saves the information to the DB for a User
    // to allow the grpahql to save to the databsae 
        createUser: (args) => {
            // Will look to see if the email is already in the DB
            // If already in the DB will error saying USer already exists
            // IF not, will carry on the code to create the user
            return User.findOne({email: args.userInput.email})
            .then(user => {
                if (user) {
                    throw new Error('User exists already.')
                }
            // the bcrypt takes in the string of the inputted password
            // it is then Salted 12 times
            // 12 is classed as a safe number of times to salt the password
                return bcrypt
                .hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    username: args.userInput.username,
                    email: args.userInput.email,
                    password: hashedPassword
                })
                // Save the created User
                return user.save()
            })
            .then(result => {
                // password will return as null so can never be sent back even in hash form 
                return { ...result._doc, password: null, _id: result.id}
            })
            .catch(err => {
                throw err
            })

        }
    },
    
    graphiql: true
    })
);

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