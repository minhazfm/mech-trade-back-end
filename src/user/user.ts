import { ApiHandler } from '../interfaces/interfaces';
// import { DynamoDbService } from '../shared/dynamo-db';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// const dynamoDbService: DynamoDbService = new DynamoDbService();
const userService: UserService = new UserService();
const userController: UserController = new UserController(userService);

export const createUser: ApiHandler = userController.createUser;