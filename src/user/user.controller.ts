import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateUser, User } from '../interfaces/interfaces';
import { ResponseBuilder } from '../shared/response-builder';
import { UserService } from './user.service'

export class UserController {

    constructor(private readonly userService: UserService) { }

    public createUser: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        const body: any = JSON.parse(event.body);
            
        if (!body.firstName || !body.lastName) {
            return ResponseBuilder.serverError(new Error('Missing required body JSON parameters'), callback);
        }

        const newUser: CreateUser = {
            firstName: body.firstName,
            lastName: body.lastName,
            userId: event.requestContext.identity.cognitoIdentityId
        };

        return this.userService.putUser(newUser)
            .then((response: User) => {
                const result = {
                    success: true,
                    result: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });

        // try {
        //     const body: any = JSON.parse(event.body);
            
        //     if (!body.firstName || !body.lastName) {
        //         throw new Error('Missing name attribute');
        //     }
    
        //     const newUser: CreateUser = {
        //         firstName: body.firstName,
        //         lastName: body.lastName,
        //         userId: event.requestContext.identity.cognitoIdentityId
        //     };
    
        //     return this.userService.putUser(newUser)

    
        //     const result = {
        //         success: true
        //     };
    
        //     return ResponseBuilder.success(result, callback);
        // }
        // catch (error) {
        //     return ResponseBuilder.serverError(error, callback);
        // }
    };

}