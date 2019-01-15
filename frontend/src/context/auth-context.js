import React from 'react'

export default React.createContext({
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
})

// We use the context as a central storage to allow other ocmponmets to access everything from instead of props all the time
// context is an inbuilt React feature - you could use Redux instead

// We inport the context to the highest level in the tree, so it can filter down to all parts (children) 
// for us we use App.js