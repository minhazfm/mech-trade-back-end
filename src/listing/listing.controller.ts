import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateListing, Listing, ListingComment, CreateListingComment } from '../interfaces/interfaces';
import { ListingService } from './listing.service';
import { ResponseBuilder } from '../shared/response-builder';

export class ListingController {

    constructor(private readonly listingService: ListingService) { }

    // private isListingObject = (input: any) => {
    //     const schema: Record<keyof CreateListing, string> = {
    //         currentPrice: 'string',
    //         description: 'string',
    //         listingId: 'string',
    //         subTitle: 'string',
    //         title: 'string',
    //         userId: 'string'
    //     };
    
    //     const missingProperties = Object.keys(schema)
    //         .filter(key => input[key] === undefined)
    //         .map(key => key as keyof CreateListing)
    //         .map(key => new Error(`Document is missing ${key} ${schema[key]}`));
    
    //     // Throw the errors if you choose
    //     return missingProperties.length === 0;
    // };

    public createComment: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        const body: any = JSON.parse(event.body);

        if (!body.listingId || !body.message || body.listingId === '' || body.message === '') {
            return ResponseBuilder.serverError(new Error('Missing required body JSON parameters: listingId and message'), callback);
        }

        const newComment: CreateListingComment = {
            listingId: body.listingId,
            message: body.message,
            userId: event.requestContext.identity.cognitoIdentityId
        };

        return this.listingService.createComment(newComment)
            .then((response: ListingComment) => {
                const result = {
                    success: true,
                    result: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });
    };

    public createListing: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        const body: any = JSON.parse(event.body);

        if (!body.category || 
            !body.city || 
            !body.country ||
            !body.currentPrice ||
            !body.description ||
            !body.subTitle ||
            !body.title) {
            return ResponseBuilder.serverError(new Error('Missing required body JSON parameters'), callback);
        }

        const newListing: CreateListing = {
            category: body.category,
            city: body.city,
            country: body.country,
            currentPrice: body.currentPrice,
            description: body.description,
            subTitle: body.subTitle,
            title: body.title,
            userId: event.requestContext.identity.cognitoIdentityId
        };

        return this.listingService.putListing(newListing)
            .then((response: Listing) => {
                const result = {
                    success: true,
                    result: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });
    };

    public getAllListings: ApiHandler = async (_event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        return this.listingService.getAllListings()
            .then((response: Array<Listing>) => {
                const result = {
                    success: true,
                    result: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });
    };

    public getListing: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        const listingId = event.queryStringParameters.id;

        return this.listingService.getListing(listingId)
            .then((response: Listing) => {
                const result = {
                    success: true,
                    result: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });
    };

}