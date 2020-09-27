import { User } from "../entities/User";
import MyContext from "src/types";
import { Resolver, Arg, Field, Ctx, Mutation, ObjectType, Query, FieldResolver, Root } from "type-graphql";
// argon2 -> 해슁
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";
// 에러핸들
@ObjectType()
class FieldError{
    @Field()
    field: string;
    @Field()
    message: string;
}
@ObjectType()
class UserResponse{
    
    // error가있으면 err리턴, user가있으면 user리턴함
    @Field(() => [FieldError], { nullable: true }) 
    errors?: FieldError[]

    @Field(()=> User, {nullable:true})
    user?:User

}

@Resolver(User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    me(
        @Ctx() {req}: MyContext
    ) {        
        //not logged in
        if (!req.session.userId) {
            return null
        }
        return User.findOne(req.session.userId);
    
    }
    
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        // show email
        if (req.session.userId === user.id) {
            return user.email;
        }
        return "";
    }

    //register
    @Mutation(() => UserResponse)
    async register(
    // 인자 여러개를 주는 대신 객체하나를 만들어서 넘겨줘도 된다.
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {req} : MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) { return { errors } }
        const hashedPassword = await argon2.hash(options.password);

        // query build
        let user;
        try {
            
            // User.create({}).save()
            const result = await getConnection().createQueryBuilder().insert().into(User).values(
                {
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                }

            )
            .returning('*')
                .execute();
            user = result.raw[0];
        } catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [{
                        field: "username",
                        message: "username is not unique",
                    }]
                }
            }
        }
        req.session.userId = user.id;
        return {user};
    }



    //login
    @Mutation(() => UserResponse)
    async login(
    // 인자 여러개를 주는 대신 객체하나를 만들어서 넘겨줘도 된다.
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() {req} : MyContext
    ): Promise<UserResponse>{
        const user = await User.findOne(        
            usernameOrEmail.includes('@')
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
        );
        if (!user) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'that username doen\'t exist'
                }]
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
                return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            };
        
        
        }
        //store user id session, set a cookie on the user, keep logged in
        req.session.userId = user.id;
        return {
            user
        }
    }

    //logout
    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext)
     {
        return new Promise((resolve) => req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME)
            if (err) {
                resolve(false);
                return
            }
            resolve(true)
        }))
    }

    
    // forgot password
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email:string,
        @Ctx() {redis}: MyContext){
        const user = await User.findOne({ where: { email } });
            if(!user){
            // the email is not in the db
            return false;
            }   
        let token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id,'ex',1000* 60 * 60 * 24 * 3); //3days
        await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        // const user = await em.findOne(User, { email });
        return true;
    }

    //change password

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx(){redis,req}: MyContext
    ): Promise<UserResponse>{
        if (newPassword.length <= 4) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "length must be greater than 4"
                }
                ]
            }
        }
        const key= FORGET_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired"
                    }
                ]
            }
        }
        
        const userIdInt = parseInt(userId);
        const user = await User.findOne(userIdInt);
        
        if (!user) {
            return {
                errors:[{
                    field: 'token',
                    message:'user no longer exist'
                }]
            }
        }

        await User.update(
            { id: userIdInt },
            {
                password: await argon2.hash(newPassword)
            }
        );

        redis.del(key);
        //login user after change password
        req.session.userId = user?.id;
        
        return { user }
    
    }
    
}



