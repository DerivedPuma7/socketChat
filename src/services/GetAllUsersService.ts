import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
class GetAllUsersService {
    async execute(): Promise<User[]> {
        const users = await User.find();
        return users
    }
}

export default GetAllUsersService;