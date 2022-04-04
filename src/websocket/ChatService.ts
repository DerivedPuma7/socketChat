import { container } from "tsyringe";
import { io } from "../http";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersService from "../services/GetAllUsersService";
import GetUserBySocketIdService from "../services/GetUserBySocketIdService";

io.on("connect", socket => {
    socket.on("start", async data => {
        const { email, avatar, name } = data;
        const createUserService = container.resolve(CreateUserService);

        const user = await createUserService.execute({
            email,
            avatar,
            name,
            socket_id: socket.id
        });

        socket.broadcast.emit("new_users", user);
    });

    socket.on("get_user", async (callback) => {
        const getAllUsersService = container.resolve(GetAllUsersService);

        const users = await getAllUsersService.execute();

        callback(users);
    });

    socket.on("start_chat", async (data, callback) => {
        const createChatRoomService = container.resolve(CreateChatRoomService);
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);

        console.log('data', data);

        const userLogged = await getUserBySocketIdService.execute(socket.id);
        const userLoggedId = userLogged._id;

        const userChatTargetId = data.idUser

        const room = await createChatRoomService.execute([userLoggedId, userChatTargetId]);

        callback({ room });
    })
});