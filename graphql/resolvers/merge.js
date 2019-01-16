const User = require('../../models/user')
const Patient = require('../../models/patient')


// Refactored code for transforming patients
const transformPatient = patient => {
    return { ...patient._doc,
        _id: patient.id
    }
};
// For all Patients 
const patients =  async patientIds => {
    try {
    const patients = await Patient.find({ _id: {$in: patientIds}})
    return patients
    .map(patient => {
            return transformPatient(patient)
            })
        }   
        catch(err) {
        throw err
    }
}; 

// We are overriding the creator object data
// To override the _id to the id that mongoose provides so we can read this call back
const user =  async userId => {
    try {
    const user = await User.findById(userId)
        // spread operator (...), allows core documents from mongoose 
        return { ...user._doc, 
                _id: user.id
            }
        } catch(err){
          throw err
    }   
};

exports.patient = patients
exports.transformPatient = transformPatient

