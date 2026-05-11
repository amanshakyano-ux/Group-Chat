const token = localStorage.getItem("token");
const msgUi = document.querySelector(".messages-container");
let loggedInUserId;
const socket = io("",{auth : {
  token:localStorage.getItem("token")
}})                           //connecting frontend with Socket.IO           

async function getMe() {
 const myData =  await axios.get("/user/getUserId", {
    headers: { Authorization: token },
  });
  console.log(myData.data.userId, "MY DATA IS THIS CHECK ")
  return myData.data.userId;
}
socket.on ("message",(updatedChat)=>{         //receiving msg from
  addMessageToUI(updatedChat)
})
socket.emit("chat-message","hello")

async function sendMessage(e) {
  try {
    e.preventDefault();
    const message = e.target.message.value;

    const response = await axios.post(
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

  if (element.userId === loggedInUserId) {

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