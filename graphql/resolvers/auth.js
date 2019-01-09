const bcrypt = require('bcryptjs')
const User = require('../../models/user')

module.exports = { 
// Creates and saves the information to the DB for a User
// to allow the grpahql to save to the databsae 
    createUser: async args => {
        try {
        // Will look to see if the email is already in the DB
        // If already in the DB will error saying User already exists
        // If not, will carry on the code to create the user
        const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already.')
            }
        // the bcrypt takes in the string of the inputted password
        // it is then Salted 12 times
        // 12 is classed as a safe number of times to salt the password
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPassword
            })
        // Save the created User
        const result = await user.save()
        // password will return as null so can never be sent back even in hash form 
        return { ...result._doc, 
                password: null, 
                _id: result.id}
            } 
            catch(err) {
            throw err
        }
    }
}