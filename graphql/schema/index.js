const { buildSchema } = require('graphql')

module.exports = buildSchema(`

schema {
    query: RootQuery
    mutation: RootMutation
}

type RootQuery {
    listAllPatients: [Patient!]!
    login(username: String!, password: String!): AuthData!
}

type RootMutation {
    createPatient(patientInput: PatientInput): Patient
    createUser(userInput: UserInput): User
}

##################################################################################
##################################################################################
#
# The Types: 
#

type Patient {
    _id: ID!
    title: String!
    forename: String!
    surname: String!
    age: Int!
}

type User {
    _id: ID!
    username: String!
    password: String
    # Password can be null as we should never want to return the password from the DB to the user 
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

##################################################################################
##################################################################################
#
# Input is the required input for the create Mutations
#

input PatientInput {
    title: String!
    forename: String!
    surname: String!
    age: Int!
}

input UserInput {
    username: String!
    password: String!
}
`)