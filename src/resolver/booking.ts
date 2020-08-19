
import { Request } from "express";
import Booking from "../model/booking";
import Event from '../model/event';
import { transformBooking, transformEvent } from './merge';
export default {

    bookEvent: async (args, req: Request) => {
        if (!req.body.isAuth || !req.body.userId) {
            throw new Error("Unauthenticated!!");
        }
        try {
            const event = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: req.body.userId,
                event: event
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err;
        }

    },

    booking: async (args, req: Request) => {
        if (!req.body.isAuth || !req.body.userId) {
            throw new Error("Unauthenticated!");
        }
        try {
            const bookings = await Booking.find({ user: req.body.userId });
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    bookings: async (args, req: Request) => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },


    cancelBooking: async (args: { bookingId: string }, req: Request) => {
        if (!req.body.isAuth || !req.body.userId) {
            throw new Error("Unauthenticated!");
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking?.event!);
            await Booking.deleteOne({ _id: args.bookingId })
            return event;
        } catch (err) {
            throw err;
        }
    }
}