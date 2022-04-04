const socket = io("http://localhost:3000");

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
      console.log('get_user', users);

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
      <div class="row col-md-12 flex flex-row">
        <div class="col-md-3 col-lg-2">
            <img
              class="nav_avatar"
              style="object-fit: fill;"
              src="${user.avatar}"
            />
        </div>

        <div class="row col-md-9 flex flex-column"> 
          <div>
            <p class="text-capitalize mb-0">${user.name}</p>
          </div>
          <div>
            <small class="text-lowercase">${user.email}</small>
          </div>
        </div>
      </div>
    </li>
  `;
}

onLoad();