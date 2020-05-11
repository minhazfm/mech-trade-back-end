import { CreateListing } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';
import * as uuid from 'uuid';

export class ListingService {

    public constructor() {

    }

    public async putListing(listing: CreateListing) {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: {
                city: listing.city,
                country: listing.country,
                currentPrice: listing.currentPrice,
                description: listing.description,
                subTitle: listing.subTitle,
                title: listing.title,

                // Main properties
                country_city: listing.country + '_' + listing.city,
                createdAt: Date.now(),
                listingId: uuid.v4(),
                sellerId: 'owner' + '_' + listing.userId,
                sortKey: 'listing'
            }
        };

        return await dynamodb.putItem(params);
    };

}