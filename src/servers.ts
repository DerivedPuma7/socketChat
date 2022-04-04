import { server } from "./http";
import "./websocket/ChatService";

server.listen(3000, () => {
    console.log("rodandoooo na 3000");
});