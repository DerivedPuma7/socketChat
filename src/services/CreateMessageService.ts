import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface CreateMessageDTO {
    to: string,
    text: string,
    roomId: string
}

@injectable()
class CreateMessageService {
    async execute({to, text, roomId}: CreateMessageDTO) {
        const message = await Message.create({
            to,
            text,
            roomId,
            created_at: new Date()
        });

        return message;
    }
}

export default CreateMessageService;