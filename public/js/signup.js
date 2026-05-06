 
 const responseMsg = document.getElementById("alert-msg")
 
 
 async function signup(e){
    e.preventDefault()
     try{
const userData = {
         username: e.target.username.value,
      password: e.target.password.value,
      email :e.target.email.value,
     phoneNumber  : e.target.phoneNumber.value,
         
    }
    
    const result =  await axios.post("/user/signup",userData)
      window.location.href = "/login"
     }
     catch(err){
        console.log(err)
       responseMsg.innerText = err.response.data.message
        
     }
   
    
 }