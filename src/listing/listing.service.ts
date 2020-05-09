import { CreateListing } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';

export class ListingService {

    public constructor() {

    }

    public async putListing(listing: CreateListing) {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: listing
        };

        return await dynamodb.putItem(params);
    };

}