import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import Event, { IEvent } from './model/event';
import User, { IUser } from './model/user';
import graphQLSchema from "./schema/index";
import graphQLResolver from "./resolver";
import { authHandler } from "./middleware/auth";

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(authHandler);

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true
}))

// mongoose.connect(`mongodb+srv://db_user:<password>@cluster0-5toay.mongodb.net/<dbname>?retryWrites=true&w=majority`)

const credential = `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}`;
const db = `${process.env.MONGO_DB}`;
mongoose.connect(
    `mongodb+srv://${credential}@cluster0-5toay.mongodb.net/${db}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    app.listen(3000);
}).catch(err => console.error(err))


