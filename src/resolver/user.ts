import bcrypt from "bcrypt";
import User, { UserInput, AuthData } from "../model/user";
import jwt from 'jsonwebtoken';
import { __secretKey } from "../env/env";
import { transformUser } from "./merge";

export default {

    users: async () => {
        try {
            const users = await User.find();
            return users.map((user: any) => {
                return transformUser(user);
            })
        } catch (err) {
            throw new Error(err);
        }
    },
    createUser: async (args: { userInput: UserInput }) => {
        const existingUser = await User.findOne({ email: args.userInput.email });
        if (existingUser) {
            throw new Error("User exists already.");
        }
        try {
            const pass = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: pass
            });
            const result = await user.save();
            return { ...result._doc, _id: result.id }
        } catch (error) {
            throw error;
        }
    },

    login: async ({ email, password }): Promise<AuthData> => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not found!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is not correct!');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            __secretKey,
            {
                expiresIn: '1h'
            }
        )
        return { userId: user.id, token: token, expiration: 1 }
    },


}