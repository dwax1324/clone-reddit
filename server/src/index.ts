import { ApolloServer } from 'apollo-server-express';
import 'dotenv-safe/config'
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
//세션저장
import Redis from 'ioredis';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
// import MyContext from './types';
//typeorm
import bodyParser from'body-parser'
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
import { Updoot } from './entities/Updoot';
import { User } from './entities/User';
import { HelloResolver } from './resolver/hello';
import { PostResolver } from './resolver/post';
import { UserResolver } from './resolver/user';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';

const main = async () => {

    const connection = await createConnection({
      type: "postgres",
      url:process.env.DATABASE_URL,
      entities: [Post, User, Updoot],
      synchronize: false,
      logging: true,
      migrations: [path.join(__dirname, "./migrations/*")],
    });
    // User.delete({});
    // Post.delete({});
    // Updoot.delete({});
    // connection.runMigrations();
    // await Post.delete({})
    // mikroORM이 sql에서  migrate안된 것을 migrate해준다.

    const app = express();
    //req대신 _ (req를 쓰지 않겠다는 practice)

    // app.use(cors());
    // app.use(bodyParser.json());


    //세션 (미들웨어 위에 놓아야함)
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set('proxy', 1);
    
    
    app.use(
        session({
        name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch:true,
        }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__, //cookie only works in https,
                domain: __prod__  ? ".woojong.xyz": undefined
            },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
        }),
        cors({
        credentials: true,
            origin: process.env.CORS_ORIGIN
        })
    )
    console.log(process.env.CORS_ORIGIN);
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        // context -> resolver에 access가능한 객체
        context: ({ req, res }) => ({
            req, res, redis, userLoader: createUserLoader(),
            updootLoader: createUpdootLoader()
        })
        
    })

    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log(`listening on : ${process.env.PORT}`)
    })
    

    // const llpost = orm.em.create(Post, { title:"qweeqqweqwwerqw"});
    // await orm.em.persistAndFlush(post);
    // await orm.em.nativeInsert(llpost)
}

main().catch(err => console.error(err));