const responseMsg = document.getElementById("alert-msg");
 
async function handleLogin(e) {
    try{
      e.preventDefault();
        const userData = {
            phoneNumber:e.target.phoneNumber.value,
            password:e.target.password.value
        }
       const user = await axios.post("/user/login",userData)
         localStorage.setItem("token",user.data.token)
         window.location.href = "/chat";
        
    }catch(err){
        console.log("ERROR GOT",err)
      responseMsg.innerText = err.response.data.message || "Login Failed"
    }
    
}