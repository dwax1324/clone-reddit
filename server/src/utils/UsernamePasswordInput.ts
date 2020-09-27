import { InputType, Field } from "type-graphql";

// @objecttype -> return , @inputtype -> argument
@InputType()
export class UsernamePasswordInput {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
}
