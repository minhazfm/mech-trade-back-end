import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateListing } from '../interfaces/interfaces';
import { ListingService } from './listing.service';
import { ResponseBuilder } from '../shared/response-builder';
import * as uuid from 'uuid';

export class ListingController {

    constructor(private readonly listingService: ListingService) { }

    private isListingObject = (input: any) => {
        const schema: Record<keyof CreateListing, string> = {
            currentPrice: 'string',
            description: 'string',
            listingId: 'string',
            subTitle: 'string',
            title: 'string',
            userId: 'string'
        };
    
        const missingProperties = Object.keys(schema)
            .filter(key => input[key] === undefined)
            .map(key => key as keyof CreateListing)
            .map(key => new Error(`Document is missing ${key} ${schema[key]}`));
    
        // Throw the errors if you choose
        return missingProperties.length === 0;
    };

    public createListing: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        try {
            const body = JSON.parse(event.body as string);
            
            // if (!this.isListingObject(body)) {
            //     throw new Error('Missing attributes');
            // }
    
            const newListing: CreateListing = {
                currentPrice: '400',
                description: 'Brand new, never been used',
                listingId: uuid.v4(),
                subTitle: 'Won\'t last long!',
                title: 'New SINGA v3',
                userId: event.requestContext.identity.cognitoIdentityId
            };
    
            await this.listingService.putListing(newListing);
    
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