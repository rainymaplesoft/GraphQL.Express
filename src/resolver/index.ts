import EventResolver from './events';
import UserResolver from './user';
import BookingResolver from './booking'
export default {
    ...EventResolver,
    ...UserResolver,
    ...BookingResolver
}


