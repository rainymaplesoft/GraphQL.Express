import Event, { IEvent } from '../model/event';
import User from '../model/user';
import DataLoader from 'dataloader';
import { IUser } from '../model/user';
const dateToString = (date: string) => new Date(date).toISOString();



const events = async (eventIds: any) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.sort((a, b) => {
            return (
                eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
            );
        });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async (eventId: any) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
};

const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
});

const user = async (userId: any) => {
    try {
        const user = await userLoader.load(userId.toString());
        return transformUser(user);
    } catch (err) {
        throw err;
    }
};
export const transformEvent = (event: IEvent): any => {
    return {
        ...event._doc,
        _id: event.id,
        creator: () => user(event.creator)
    }
}

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

export const transformUser = (user: IUser): any => {
    const createdEvents = user.createdEvents
        ? () => eventLoader.loadMany(user.createdEvents!)
        : () => [];
    return {
        ...user._doc,
        _id: user.id,
        password: '',   // never reveal password
        createdEvents: createdEvents
    };
}









