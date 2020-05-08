import { ApiHandler } from '@interfaces/interfaces';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const service: UserService = new UserService();
const controller: UserController = new UserController(service);

export const createUser: ApiHandler = controller.createUser;