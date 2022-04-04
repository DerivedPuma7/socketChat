import { injectable } from "tsyringe";
import { User } from "../schemas/User";

interface CreateUserDTO {
    email: string,
    socket_id: string
    avatar: string
    name: string,
}

@injectable()
class CreateUserService {
    async execute({ name, socket_id, avatar, email }: CreateUserDTO): Promise<User> {
        const userAlreadyExists = await User.findOne({ email }).exec();

        if(userAlreadyExists) {
            const user = await User.findOneAndUpdate(
                {
                    _id: userAlreadyExists._id //where
                },
                {
                    $set: {
                        socket_id, avatar, name //set
                    }
                },
                {
                    new: true
                }
            )
            return user;
        }

        const user = await User.create({
            email,
            socket_id,
            avatar,
            name
        });

        return user;
    }
}

export default CreateUserService;