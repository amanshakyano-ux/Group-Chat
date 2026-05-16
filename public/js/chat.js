const token = localStorage.getItem("token");
const msgUi = document.querySelector(".messages-container");
let loggedInUserId;
let activeRoom = null;
let currentMode = "public";
const roomInput = document.getElementById("roomInput");
const activeRoomText = document.getElementById("active-room");
const chatTitle = document.getElementById("chat-title");
const email = localStorage.getItem("email")
const activeUsers = document.getElementById("active-users")
const msgBox = document.getElementById("message")
const isLive  = document.getElementById("online-status")
 

const aiSuggestions = document.getElementById("aiSuggestions");

const smartReplies = document.getElementById("smartReplies");

let debounceTimer;
msgBox.addEventListener("input", () => {
  //  if(currentMode !== "gemini") return;
  
  clearTimeout(debounceTimer);
const text = msgBox.value.trim();
 if (!text) {
    aiSuggestions.innerHTML = "";
    return;
  }
   debounceTimer = setTimeout(async () => {
    try {
      const res = await axios.post("/ai/suggestions", {
        text,
      });

      showSuggestions(res.data);
    } catch (err) {
      console.log(err);
    }
  }, 600);
});


function showSuggestions(suggestions) {
  aiSuggestions.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const btn = document.createElement("button");

    btn.type = "button";

    btn.innerText = suggestion;

    btn.classList.add("suggestion-btn");

    btn.onclick = () => {
      msgBox.value += " " + suggestion;

      aiSuggestions.innerHTML = "";
    };

    aiSuggestions.appendChild(btn);
  });
}


async function loadSmartReplies(message) {
  try {
    const res = await axios.post("/ai/replies", {
      message,
    });

    showSmartReplies(res.data);
  } catch (err) {
    console.log(err);
  }
}

function showSmartReplies(replies) {
  smartReplies.innerHTML = "";

  replies.forEach((reply) => {
    const btn = document.createElement("button");

    btn.type = "button";

    btn.innerText = reply;

    btn.classList.add("reply-btn");

    btn.onclick = () => {
      msgBox.value = reply;
    };

    smartReplies.appendChild(btn);
  });
}





  


const socket = io("",{auth : {
  token:localStorage.getItem("token")
}})                           //connecting frontend with Socket.IO           




 
function joinRoom(){

   const roomValue = roomInput.value.trim();

   if(!roomValue) return;

   const myEmail =
   localStorage.getItem("email");
   if(myEmail === roomValue)
   {
       activeRoomText.innerText = "You can't use own email."
       activeRoomText.style.color = "red"
       return;
   }

   const roomName =
   [myEmail, roomValue]
   .sort()
   .join("-");

   socket.emit("join_room", roomName);

}



socket.on("room_joined",(data)=>{
  
  activeRoom = data.room;
  
  
  currentMode = "private";
  
  msgUi.innerHTML = "";
  
   activeRoomText.innerText =
   "Room created";
   
   chatTitle.innerText =
   "Private Room";
   
   if(data.roomSize === 2)
   {
     activeUsers.innerText ="Online";
   }else{
    activeUsers.innerText ="Wait for your partner";
   }
  
   
   roomInput.value = "";
   
  });

  socket.on("receive_media",(data)=>{
     if (currentMode !== "private") return;
      addMediaToUI(data)
  })
  socket.on("broadcast-media",(link)=>{
    if(currentMode !== "private"){
      addMediaToUI(link)
    }

  })

 

  function addMediaToUI(data){
if(currentMode !== "private") {
  alert("upload feature only of rooms")
  return;
}
   const div =
   document.createElement("div");

    div.style.display = "flex";

div.style.flexDirection =
"column";

   const span =
   document.createElement("span");

   const name = document.createElement("small")
   name.textContent = data.userName
   name.style.justifyContent="center"

   // sent / received
   if(
      Number(data.userId)
      === loggedInUserId
   ){

      div.classList.add(
         "message",
         "sent",
         "media-message",
      );

   }else{

      div.classList.add(
         "message",
          "media-message",
         "received"
         
      );
      div.appendChild(name)

   }

   // IMAGE
   if(
      data.mediaType
      .startsWith("image/")
   ){

      const img =
      document.createElement("img");

      img.src =
      data.mediaUrl;

      img.style.width =
      "200px";

      img.style.borderRadius =
      "10px";

      div.appendChild(img);
    }
    
    // VIDEO
    else if(
      data.mediaType
      .startsWith("video/")
    ){

      const video =
      document.createElement("video");
      
      video.src =
      data.mediaUrl;
      
      video.controls =
      true;
      
      video.style.width =
      "220px";

      div.appendChild(video);
      
    }
    
     
   span.textContent =
   new Date(
      data.createdAt
   ).toLocaleTimeString([],{

      hour : "2-digit",

      minute : "2-digit"

   });
   


   div.appendChild(span);

   msgUi.appendChild(div);

   msgUi.scrollTop =
   msgUi.scrollHeight;

}


 const mediaInput =
document.getElementById("mediaInput");


mediaInput.addEventListener(
   "change",
   uploadMedia
);
async function uploadMedia(e){

   try{
    

      const file =
      e.target.files[0];
      console.log("FILE ->",file)

      if(!file) return;

      const formData =
      new FormData();

      formData.append(
         "media",
         file
      );
 
      formData.append(
         "room",
         activeRoom
      );
      
      
        

      await axios.post(

         "/message/upload-media",

         formData,

         {
            headers:{
               Authorization : token
            }
         }

      );

      mediaInput.value = "";

   }catch(err){
console.log("FRONTEND ERROR")
      console.log(
         err.response?.data?.message
         || err.message
      );

   }

}
let typingTimeout;

msgBox.addEventListener("input", () => {
   

  if (currentMode !== "private" || !activeRoom) return;
 

  // emit once per typing session
  socket.emit("typing_start", {
    room: activeRoom
  });
 
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("typing_stop", {
      room: activeRoom
    });
  }, 1000);
  
});



socket.on("show_typing", ({ user }) => {
   
  if (currentMode !== "private") return;

 activeUsers.innerText = `${user} is typing...`;
});

socket.on("hide_typing", () => {

   

  if (currentMode !== "private") return;

   activeUsers.innerText = "Online";
});
  socket.on("room_error",(data)=>{
    activeRoomText.innerText =
    data.message;
    activeRoomText.style.color = "red"
    
  });
socket.on("online_users",(count)=>{
  activeUsers.innerText =  onlineUsersCountFormat(count)
})
function onlineUsersCountFormat (number){
  switch(number){
    case  1: return `1 user online`
     
    case  0: return `0 user online`
    
    default : return `${number} users online`
  }
}

async function getMe() {
 const myData =  await axios.get("/user/getUserId", {
    headers: { Authorization: token },
  });
  console.log(myData.data.userId, "MY DATA IS THIS CHECK ")
  return myData.data.userId;
}
socket.on ("message",(updatedChat)=>{  


 
  if(currentMode !== "public") return;       //receiving msg from
  addMessageToUI(updatedChat)
   if(Number(updatedChat.userId) !== loggedInUserId){

     loadSmartReplies(updatedChat.message);

  }
  
})
socket.emit("chat-message","Connected")


async function sendMessage(e) {

  try {

    e.preventDefault();

    const message = e.target.message.value;

    // PRIVATE ROOM MESSAGE
    if(currentMode === "private"){
 
      socket.emit("private_message",{
         room : activeRoom,
         message
      });

      e.target.reset();

      return;
    }

    // PUBLIC MESSAGE
    await axios.post(
      "/message/send",
      { message },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    e.target.reset();

  } catch (err) {

    console.log(err.response?.data?.message || err.message);

  }
}

socket.on("receive_private_message",(data)=>{
  
  if(data.room !== activeRoom) return;
   addMessageToUI(data);

});

socket.on("room_users_count",(count)=>{

   if(currentMode !== "private") return;

   if(count === 2){

      activeUsers.innerText = "Online";

   }else{

      activeUsers.innerText = "Offline";

   }

});


async function  loadMessages() {
  try {
    const response = await axios.get("/message/messages", {
      headers: { Authorization: token },
    });
    
    return response.data.data;
  } catch (err) {
    console.log(err.response?.data?.message || err.message);
  }
}


function addMessageToUI(element) {

  const name = document.createElement("small");
  const div = document.createElement("div");

  const p = document.createElement("p");

  const span = document.createElement("span");

  p.textContent = element.message;
  
name.textContent = element.userName;

  span.textContent = new Date(
    element.createdAt
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (Number(element.userId) === loggedInUserId) {

    div.classList.add("message", "sent");

  } else {

    div.classList.add("message", "received");
    div.appendChild(name);

  }
    

  div.appendChild(p);

  div.appendChild(span);

  msgUi.appendChild(div);

  msgUi.scrollTop = msgUi.scrollHeight;

}

async function renderMessage() {

  try {

    loggedInUserId = await getMe();

    const messages = await loadMessages();
     

    msgUi.innerHTML = "";

    messages.forEach((element) => {

      addMessageToUI(element);

    });

  } catch (err) {

    console.log(
      err.response?.data?.message || err.message
    );

  }

}
window.addEventListener("DOMContentLoaded",()=>{
renderMessage();

})