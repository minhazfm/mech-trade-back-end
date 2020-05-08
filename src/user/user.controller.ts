import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateUser } from '@interfaces/interfaces';
import { ResponseBuilder } from '@libs/response-builder.lib';
import { UserService } from './user.service'

export class UserController {

    constructor(private readonly userService: UserService) { }

    public createUser: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        try {
            const body = JSON.parse(event.body as string);
            
            if (!body.name) {
                throw new Error('Missing name attribute');
            }
    
            const newUser: CreateUser = {
                isOnline: false,
                name: body.name,
                userId: event.requestContext.identity.cognitoIdentityId ?? ''
            };
    
            await this.userService.putUser(newUser);
    
            const result = {
                success: true
            };
    
            return ResponseBuilder.success(result, callback);
        }
        catch (error) {
            return ResponseBuilder.serverError(error, callback);
        }
    };

}