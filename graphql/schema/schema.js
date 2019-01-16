const graphql = require ('graphql')
const _ = require('lodash')

const Patient = require('../../models/patient')
const Doctor = require('../../models/doctor')

const { GraphQLObjectType, 
        GraphQLString,
        GraphQLInt,
        GraphQLID,
        GraphQLList,
        GraphQLSchema } = graphql

// Define Schema types 
// Define relationships between types 
// Define the Root querys
// Define the muttations

// -------------------------------------------------------------------------------------
// Type section ------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

const PatientType = new GraphQLObjectType({
    // Defining an object type - Called Patient with Fields inside the object
    name: 'Patient',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        forename: { type: GraphQLString },
        surname: { type: GraphQLString },
        age:  { type: GraphQLInt },
        doctor: {
            type: DoctorType,
            // The parent is all the info in the above type  (Patient)
            // We check to see if the DoctorId matches the id: from the doctor 
            resolve(parent, args){
                //return _.find(doctorsDb, {id: parent.doctorId})
            }
        }
    })
});

const DoctorType = new GraphQLObjectType({
    // Defining an object type - Called Patient with Fields inside the object
    name: 'Doctor',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        forename: { type: GraphQLString },
        surname: { type: GraphQLString },
        jobrole: { type: GraphQLString },
        age:  { type: GraphQLInt },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        patients: {
            // Will allow us to create a List of results instead of just a single item
            type: new GraphQLList(PatientType),
            resolve(parent, args){
                // We look through the patients DB to match any doctorId with the Doctors ID
                // If not mataching it filters it out of the array 
                //return _.filter(patientsDb, {doctorId: parent.id})
            }
        }
    })
});

// -------------------------------------------------------------------------------------
// Query section -----------------------------------------------------------------------
// -------------------------------------------------------------------------------------

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        onePatient: {
            type: PatientType,
            // Argument passed into the query (id:)
            args:{ id: {type: GraphQLID}},
            resolve(parent, args){
                // The Resolve will get the result from our DB
                // lodash looks through the DB/ array
                // Finds any book matching the same ID from the inputted args
                //return _.find(patientsDb, {id: args.id})
            }
        },

        oneDoctor: {
            type: DoctorType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(doctorsDb, {id: args.id})
            }
        },

        allPatients: {
            // We want just a list of the patient type
            // As the relationship is already stated with Patients and Dr we can still access both types 
            type: new GraphQLList(PatientType),
            resolve(parent, args){
                // we return all the information from the DB
                //return patientsDb
            }
        },

        allDoctors: {
            type: new GraphQLList(DoctorType),
            resolve(parent, args){
                //return doctorsDb
            }
        },
    }
});

// -------------------------------------------------------------------------------------
// Mutation section --------------------------------------------------------------------
// -------------------------------------------------------------------------------------

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: { 
        addPatient: {
            // We need to pass in the arguments to GQL to make a patient
            type: PatientType,
            args: {
                title: { type: GraphQLString },
                forename: { type: GraphQLString },
                surname: { type: GraphQLString },
                age:  { type: GraphQLInt }
            },
            // Those arguments go to the required space
            resolve(parent, args){
                let patient = new Patient({
                    title: args.title,
                    forename: args.forename,
                    surname: args.surname,
                    age: args.age
                })
                // Mongoose saves to the DB and return it
                return patient.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation: Mutation
})