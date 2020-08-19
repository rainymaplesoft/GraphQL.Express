import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

const eventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export interface IEvent extends Document {
    _doc: any;
    title: string;
    description: string;
    price: number;
    date: Date;
    creator: IUser
}
export interface EventInput {
    title: string;
    description: string;
    price: number;
    date: string;
    creator: string;
}
export default mongoose.model<IEvent>('Event', eventSchema);


