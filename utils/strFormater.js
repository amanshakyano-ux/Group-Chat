const formatName =  (name)=>{
    let firstName = name.trim().split(/\s+/)[0]
    firstName =  firstName[0].toUpperCase() + firstName.slice(1).toLowerCase()
    return firstName
}

 


module.exports = {formatName}