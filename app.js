const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

const events = []

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
            patient: [Patient!]!
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
        events: () => {
            return events
        },

        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event)
            return event
        }
    },
    
    graphiql: true
    })
)

app.listen(3000)