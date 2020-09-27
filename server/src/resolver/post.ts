import { Post } from "../entities/Post"
import { Resolver, Query, Ctx,  Arg, Mutation, Field, InputType, UseMiddleware, Int, FieldResolver, Root, ObjectType } from "type-graphql";
import  MyContext  from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { createUpdootLoader } from "src/utils/createUpdootLoader";


@InputType()
class PostInput{
    @Field()
    title: string
    @Field()
    text: string
}

@ObjectType()
class paginatedPosts{
    @Field(() => [Post])
    posts: Post[]
    @Field()
    hasMore: Boolean

}


@Resolver(Post)
export class PostResolver {
  // graphql type
  @Query(() => paginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<paginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    //$1,$2 -> replacement의 원소로 대체됨
    const posts = await getConnection().query(
      `
            select p.*
            from post p
            ${cursor ? `where p."createdAt" < $2` : ""}
            order by p."createdAt" DESC
            limit $1
            `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });

    // voted before
    // and they are changing their vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            update updoot
            set value = $1
            where "postId" = $2 and "userId" = $3
            `,
          [realValue, postId, userId]
        );
        await tm.query(
          `
            update post
            set points = points + $1
            where id = $2;  
            `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      // is first vote

      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        insert into updoot ("userId", "postId", value)
        values($1,$2,$3);  
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
            update post
            set points = points + $1
            where id = $2;  
          `,
          [realValue, postId]
        );
      });
    }

    // await Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue
    // });

    // await getConnection().query(`
    //     START TRANSACTION;
    //     insert into updoot ("userId", "postId", value)
    //     values(${userId},${postId},${realValue});
    //     update post
    //     set points = points + ${realValue}
    //     where id = ${postId};
    //     COMMIT;
    //   `)

    return true;
  }


  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(@Root() post: Post, @Ctx() { updootLoader, req }: MyContext) {
    
      if(!req.session.userId) return null
    const updoot = await updootLoader.load({ postId: post.id, userId: req.session.userId })
    return updoot ? updoot.value : null;
  }
  
  

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(
    @Root() post: Post,
    @Ctx(){userLoader}:MyContext 
  ) {
    return userLoader.load(post.creatorId)
  }

  // read one
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // create
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    //graphql , typsecript declaration
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  // update
  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  //delete
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    // way 1
    // const post = await Post.findOne(id);
    // if (!post) return false;
    // if (post.creatorId !== req.session.userId) throw new Error('not authorized');
    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    // way2 cascade Updoot
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}