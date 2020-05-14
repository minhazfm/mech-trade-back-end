// import { DynamoDbService } from '../shared/dynamo-db';
import { CreateUser, User } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';

export class UserService {

    public constructor() {

    }

    private mapJsonToUser(json: any): User {
        return {
            buyerId: json.buyer_id,
            createdAt: json.created_at,
            firstName: json.first_name,
            isOnline: json.is_online,
            lastName: json.last_name,
            sellerId: json.seller_id,
            userId: json.partition_key
        };
    }

    public async putUser(user: CreateUser): Promise<User> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: {
                first_name: user.firstName,
                last_name: user.lastName,

                // Modified properties
                buyer_id: 'buyer_' + user.userId,
                created_at: Date.now(),
                is_online: false,
                partition_key: 'user_' + user.userId,
                seller_id: 'seller_' + user.userId,
                sort_key: 'user'
            }
        };

        await dynamodb.putItem(params);
        return this.mapJsonToUser(params.Item);
    };

}