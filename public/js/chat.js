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

const socket = io("",{auth : {
  token:localStorage.getItem("token")
}})                           //connecting frontend with Socket.IO           



 
function joinRoom(){

   const roomValue = roomInput.value.trim();

   if(!roomValue) return;

   const myEmail =
   localStorage.getItem("email");

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

   activeUsers.innerText =
   "Duo talk";

   roomInput.value = "";

});
socket.on("room_error",(data)=>{
   activeRoomText.innerText =
   data.message;

});

async function getMe() {
 const myData =  await axios.get("/user/getUserId", {
    headers: { Authorization: token },
  });
  console.log(myData.data.userId, "MY DATA IS THIS CHECK ")
  return myData.data.userId;
}
socket.on ("message",(updatedChat)=>{  

console.log("SENDING PRIVATE MESSAGE");
  if(currentMode !== "public") return;       //receiving msg from
  addMessageToUI(updatedChat)
})
socket.emit("chat-message","Connected")


async function sendMessage(e) {

  try {

    e.preventDefault();

    const message = e.target.message.value;

    // PRIVATE ROOM MESSAGE
    if(currentMode === "private"){
console.log("EMITTING PRIVATE MESSAGE", activeRoom);
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
  console.log("PRIVATE :",data);
  if(data.room !== activeRoom) return;
   addMessageToUI(data);

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