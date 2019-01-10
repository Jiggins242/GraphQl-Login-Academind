const jwt = require('jsonwebtoken')

// Is to check all request to see if the request have a valid auth.  

module.exports = (req, res, next) => {
    // Check the incoming request header, will lookk for 'Authorization' field is included in the request
    const authHeader = req.get('Authorization')
    if (!authHeader){
        req.isAuth = false
        return next()
    }
    // If the request has Authorization
    // We check to see if the token is valid
    // We 'Split' the header by the WhiteSpace (see example below) from Bearer and the token string
    // When split we get two values in an array, 1st: Bearer, 2nd: Token string 
    // We access the 2nd value in the array with [1]
    const token = authHeader.split(' ')[1]
    if(!token || token === ''){
        req.isAuth = false
        return next ()
    }
    // If the request has a token we check to verify that token given
    let decodedToken
    try {
    // We send in the 'token' and the private key we set up in the login request 'secretkey'
    // Will return a valid decoded token, if not valid will not return the token
        decodedToken = jwt.verify(token, 'secretkey')
    }
    catch(err){
        req.isAuth = false
        return next()
    }
    // We then double check that the decodedToken has been set properly
    if(!decodedToken){
        req.isAuth = false
        return next()
    }
    // After all the checks we can now say we have a valid token
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}

// At no point is an error thrown in the check 
// If not valid flase metadata is added instead so dosnt shut down the request
// This means we can show some information if we want but can also restrict information shown for valid and non valid data
// With GQl we only have one end point so allowing this means we dont 100% shut down the app if non valid  requests are handled


// example 
// Authorization: Bearer fdgsdasa...