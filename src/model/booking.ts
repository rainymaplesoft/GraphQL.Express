import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from './event';
import { IUser } from './user';

const bookingSchema = new Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);
export interface IBooking extends Document {
    _doc: any;
    _id: string;
    event: IEvent,
    user: IUser
}

export default mongoose.model<IBooking>('Booking', bookingSchema);
