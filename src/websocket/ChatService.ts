import { container } from "tsyringe";
import { io } from "../http";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateMessageService from "../services/CreateMessageService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersService from "../services/GetAllUsersService";
import GetChatRoomByUsersService from "../services/GetChatRoomByUsersService";
import GetMessagesByChatRoomService from "../services/GetMessagesByChatRoomService";
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
        const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
        const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);

        // usuario logado
        const userLogged = await getUserBySocketIdService.execute(socket.id);
        const userLoggedId = userLogged._id;
        
        // usuario alvo da conversa
        const userChatTargetId = data.idUser

        // sala entre os 2 usuarios
        let room = await getChatRoomByUsersService.execute([userLoggedId, userChatTargetId]);

        if(!room) {
            room = await createChatRoomService.execute([userLoggedId, userChatTargetId]);
        }

        // mensagens da sala
        const messages = await getMessagesByChatRoomService.execute(room.idChatRoom);

        socket.join(room.idChatRoom);

        callback({ room, messages });
    });

    socket.on("send_message", async data => {
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
        const createMessageService = container.resolve(CreateMessageService);

        const user = await getUserBySocketIdService.execute(socket.id);

        const message = await createMessageService.execute({
            to: user.id,
            text: data.message,
            roomId: data.idChatRoom
        });

        io.to(data.idChatRoom).emit("message", {
            message,
            user
        });
    });
});