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
                category: 'cat_' + listing.category,
                city: listing.city,
                country: listing.country,
                current_price: listing.currentPrice,
                description: listing.description,
                sub_title: listing.subTitle,
                title: listing.title,

                // Main properties
                country_city: listing.country + '_' + listing.city,
                created_at: Date.now(),
                partition_key: 'listing_' + uuid.v4(),
                seller_id: 'seller_' + listing.userId,
                sort_key: 'listing'
            }
        };

        return await dynamodb.putItem(params);
    };

}