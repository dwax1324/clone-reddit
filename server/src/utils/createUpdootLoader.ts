import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";

//[{postId:124,userId:451}...] -> [{postId:3,userId:2,value:1},.....]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number, userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
    const updootIdsToUpdoot: Record<string, Updoot> = {};
    (await updoots).forEach((updoot) => {
      updootIdsToUpdoot[`${updoot.userId} | ${updoot.postId}`] = updoot;
    });

    return keys.map(
      (key) => updootIdsToUpdoot[`${key.userId} | ${key.postId}`]
      );
  });
