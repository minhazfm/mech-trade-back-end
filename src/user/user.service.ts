import { dynamodb } from '../shared/dynamo-db';
import { CreateUser } from '@interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';

export class UserService {

    public constructor() {

    }

    public async putUser(user: CreateUser) {
        const userParams = {
            TableName: CONSTANTS.DYNAMODB_USERS_TABLE ?? '',
            Item: user
        };

        return await dynamodb.putItem(userParams);
    }

}