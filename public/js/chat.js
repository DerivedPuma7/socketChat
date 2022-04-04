const socket = io("http://localhost:3000");
let roomId = null;

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
  })
}

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
      ${user.name}
    </li>
  `;
}

document.getElementById("users_list").addEventListener("click", (e) => {
  if(e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");

    socket.emit("start_chat", { idUser }, (data) => {
      roomId = data.room.idChatRoom;
    });
  }
});

onLoad();