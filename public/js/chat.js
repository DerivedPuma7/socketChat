const socket = io("http://localhost:3000");
let idChatRoom = null;

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);

  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");

  const userLogged = document.querySelector(".user_logged");
  userLogged.innerHTML += `
    <img
      class="avatar_user_logged"
      src="${avatar}"
    />
    <strong id="user_logged">${name}</strong>
  `;
  
  socket.emit("start", {
    email,
    name,
    avatar
  });

  socket.on("new_users", user => {
    const existInDiv = document.getElementById(`user_${user._id}`);
    
    if(!existInDiv) {
      addUser(user);
    }
  });

  socket.emit("get_user", users => {
      users.map(user => {
        if(user.email !== email) {
          addUser(user)
        }
      });
  });

  socket.on("message", (data) => {
    addMessage(data);
  });

}
onLoad();

const addUser = user => {
  const usersList = document.getElementById("users_list");

  usersList.innerHTML += `
    <li
      class="user_name_list border-bottom"
      id="user_${user._id}"
      idUser="${user._id}"
    >
      <img
        class="nav_avatar"
        style="object-fit: fill;"
        src="${user.avatar}"
      />
      ${user.name} - ${user.email}
    </li>
  `;
}

document.getElementById("users_list").addEventListener("click", (e) => {
  const divMessageUser = document.getElementById("message_user");
  divMessageUser.innerHTML = "";

  if(e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");

    socket.emit("start_chat", { idUser }, (response) => {
      idChatRoom = response.room.idChatRoom;

      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to
        };

        addMessage(data);
      })
    });
  }
});

document.getElementById("user_message").addEventListener("keypress", (e) => {
  if(e.key === 'Enter') {
    const message = e.target.value;
    e.target.value = '';

    const data = {
      idChatRoom,
      message
    };
    socket.emit("send_message", data);
  }
});

const addMessage = data => {
  const divMessageUser = document.getElementById("message_user");

  divMessageUser.innerHTML += `
    <span class="user_name user_name_date">
    <img
      class="img_user"
      src="${data.user.avatar}"
    />
    <strong>${data.user.name}</strong>
    <span style="margin-left: 10px;">${dayjs(data.message.created_at).format("DD/MM HH:mm")}</span></span
  >
  <div class="messages">
    <span class="chat_message">${data.message.text}</span>
  </div>
  `;

}