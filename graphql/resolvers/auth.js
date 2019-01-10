const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    },

    login: async ({username, password}) => {
        // Check to see if the argument is matched in the DB
        // In this case if the inputted Username matches one  in the DB 
        const user = await User.findOne({ username: username })
        if (!user){
            throw new Error('User does not exist!')
        }
        //Compares the plain string password with the hashed password in the DB
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual){
            throw new Error('Password is incorrect!')
        }
        // 1st argument is what data we want to store in the token
        // 2nd is a string to hash the token, required to validate with this private key
        // 3rd is the time you want the token to expire in
        const token = jwt.sign({userId: user.id, username: user.username}, 'secretkey', {expiresIn: '1h'})
        // returns what we stated in the GQl schema for AuthData
        return {userId: user.id,
                token: token,
                tokenExpiration: 1}
    }
};