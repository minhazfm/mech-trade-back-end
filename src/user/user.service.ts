import { dynamodb } from '@app/libs/dynamo-db.lib';
import { CreateUser } from '@interfaces/interfaces';
import { CONSTANTS } from '@shared/constants';

export class UserService {

    public constructor() {

    }

    async createUser(user: CreateUser) {
        const userParams = {
            TableName: CONSTANTS.DYNAMODB_USERS_TABLE ?? '',
            Item: {
                createdAt: Date.now(),
                isAvailable: user.isAvailable,
                isOnline: user.isOnline,
                name: user.isAvailable,
                userId: user.userId
                // userId: event.requestContext.identity.cognitoIdentityId
            }
        };

        return await dynamodb.putItem(userParams);
    }

}