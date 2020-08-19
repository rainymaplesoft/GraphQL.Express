import mongoose, { Schema, Document, Model } from 'mongoose';
import { IEvent } from './event';

const userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

export interface IUser extends Document {
    _doc?: any;
    email: string;
    password: string;
    createdEvents?: IEvent[]
}
export interface IUserModel extends Model<IUser> {
}

export interface UserInput {
    email: string;
    password: string;
}
export interface AuthData {
    userId: string;
    token: string;
    expiration: number;
}
export default mongoose.model<IUser, IUserModel>('User', userSchema);


