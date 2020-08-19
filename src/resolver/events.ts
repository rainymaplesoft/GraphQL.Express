import { Request } from "express";
import Event, { IEvent, EventInput } from "../model/event";
import User from "../model/user";
import { transformEvent } from "./merge";

export default {

    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            })
        } catch (err) {
            throw err;
        }
    },

    createEvent: async (args: { eventInput: EventInput }, req: Request) => {
        if (!req.body.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event: IEvent = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(),
            creator: req.body.userId
        });
        let createdEvent;
        try {

            const result = await event.save();
            createdEvent = transformEvent(result);
            const user = await User.findById(req.body.userId);
            if (!user) {
                throw new Error("Cannot find user");
            }
            user.createdEvents?.push(event);
            await user.save();
            console.log(result);
            return createdEvent;
        } catch (e) {
            console.log(e)
        }
    },
}