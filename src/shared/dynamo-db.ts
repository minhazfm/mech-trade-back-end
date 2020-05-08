import { CONSTANTS } from '../shared/constants';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// import { CreateUser } from '@interfaces/interfaces';

const _client = new DynamoDB.DocumentClient(CONSTANTS.DYNAMODB_OPTIONS);

const deleteItem = (params: DocumentClient.DeleteItemInput) => _client.delete(params).promise();
const getItem = (params: DocumentClient.GetItemInput) => _client.get(params).promise();
const putItem = (params: DocumentClient.PutItemInput) => _client.put(params).promise();
const queryItem = (params: DocumentClient.QueryInput) => _client.query(params).promise();
const updateItem = (params: DocumentClient.UpdateItemInput) => _client.update(params).promise();

export const dynamodb = {
    deleteItem,
    getItem,
    putItem,
    queryItem,
    updateItem
};

// export class DynamoDbService {

//     private static instance: DynamoDbService;
//     private _client: DynamoDB.DocumentClient;

//     constructor() {
//         this._client = new DynamoDB.DocumentClient(CONSTANTS.DYNAMODB_OPTIONS);
//     }

//     static getInstance(): DynamoDbService {
//         if (!DynamoDbService.instance) {
//             DynamoDbService.instance = new DynamoDbService();
//         }

//         return DynamoDbService.instance;
//     }

//     async createUser(user: CreateUser) {
//         const userParams: DocumentClient.PutItemInput = {
//             TableName: CONSTANTS.DYNAMODB_USERS_TABLE ?? '',
//             Item: {
//                 createdAt: Date.now(),
//                 isAvailable: user.isAvailable,
//                 isOnline: user.isOnline,
//                 name: user.isAvailable,
//                 userId: user.userId
//             }
//         };

//         return await this._client.put(userParams).promise();
//     }

// }