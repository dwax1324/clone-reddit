import DataLoader from 'dataloader';
import { User } from '../entities/User';

//[1,2,3,4] -> [{id:1,username:'qwrwq},.....]
export const createUserLoader = () => new DataLoader<number,User>(async (userIds) => {
    const users = User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    (await users).forEach(u => {
        userIdToUser[u.id] = u;
    })


    return userIds.map((userId) => userIdToUser[userId]);

})