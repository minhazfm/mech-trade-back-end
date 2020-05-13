import { CONSTANTS } from './constants';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// import { CreateUser } from '@interfaces/interfaces';

const _client = new DynamoDB.DocumentClient(CONSTANTS.IS_OFFLINE ? { region: 'localhost', endpoint: 'http://localhost:8000' } : {});

const deleteItem = (params: DocumentClient.DeleteItemInput) => _client.delete(params).promise();
const getItem = (params: DocumentClient.GetItemInput) => _client.get(params).promise();
const putItem = (params: DocumentClient.PutItemInput) => _client.put(params).promise();
const queryItem = (params: DocumentClient.QueryInput) => _client.query(params).promise();
const scanItems = (params: DocumentClient.ScanInput) => _client.scan(params).promise();
const updateItem = (params: DocumentClient.UpdateItemInput) => _client.update(params).promise();

export const dynamodb = {
    deleteItem,
    getItem,
    putItem,
    queryItem,
    scanItems,
    updateItem
};

// export class DynamoDbService {

//     private static instance: DynamoDbService;
//     private _client: DynamoDB.DocumentClient;

//     constructor() {
//         this._client = new DynamoDB.DocumentClient(options);
//     }

//     public putItem = (params: DocumentClient.PutItemInput) => this._client.put(params).promise();

//     static getInstance(): DynamoDbService {
//         if (!DynamoDbService.instance) {
//             DynamoDbService.instance = new DynamoDbService();
//         }

//         return DynamoDbService.instance;
//     }

// }