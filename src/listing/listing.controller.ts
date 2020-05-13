import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateListing, Listing } from '../interfaces/interfaces';
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

    public createListing: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        const body = JSON.parse(event.body as string);

        const newListing: CreateListing = {
            category: 'keyboards',
            city: 'Orlando',
            country: 'United States',
            currentPrice: '400',
            description: 'Brand new, never been used. Originally bought on Reddit, only used for a few weeks.',
            subTitle: 'Won\'t last long!',
            title: 'New SINGA V3, Blood Orange',
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

    public getListing: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        // const body = JSON.parse(event.body as string);

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