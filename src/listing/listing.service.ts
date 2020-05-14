import { CreateListing, CreateListingComment, Listing, ListingComment } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';
import * as uuid from 'uuid';

export class ListingService {

    public constructor() {

    }

    private mapJsonToListing(json: any): Listing {
        return {
            category: json.category,
            city: json.city,
            country: json.country,
            createdAt: json.created_at,
            currentPrice: json.current_price,
            description: json.description,
            id: json.partition_key,
            isAvailable: json.is_available,
            sellerId: json.seller_id,
            subTitle: json.sub_title,
            title: json.title
        };
    };

    public async createComment(comment: CreateListingComment) {
        const newComment: ListingComment = {
            createdAt: Date.now(),
            id: 'comment_' + uuid.v4(),
            listingId: comment.listingId,
            message: comment.message,
            userId: comment.userId
        };

        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: {
                created_at: newComment.createdAt,
                message: newComment.message,
                partition_key: newComment.listingId,
                sort_key: newComment.id,
                user_id: newComment.userId,
            }
        };

        await dynamodb.putItem(params);
        return newComment;
    };

    public async getAllListings(): Promise<Array<Listing>> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            FilterExpression: 'sort_key = :listing',
            ExpressionAttributeValues: { ':listing' : 'listing' }
        };

        // const params = {
        //     TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
        //     // IndexName: CONSTANTS.DYNAMODB_LISTINGS_TABLE_GSI1,
        //     KeyConditionExpression: 'partition_key = :Hpartition_key',
        //     // ExpressionAttributeValues: {
        //     //     ':Hpartition_key': 'listing_b7e95bca-89a0-4135-b12a-ea01d226e084'
        //     // }
        // };

        const listings = await dynamodb.scanItems(params);
        return listings.Items?.map(item => { return this.mapJsonToListing(item); }) ?? [];
    };

    public async getListing(id: string): Promise<Listing> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Key: {
                partition_key: id,
                sort_key: 'listing'
            }
        };

        const result = await dynamodb.getItem(params);
        if (result.Item) {
            return this.mapJsonToListing(result.Item);
        }
        else {
            throw new Error('Listing not found')
        }
    };

    public async putListing(listing: CreateListing): Promise<Listing> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: {
                city: listing.city,
                country: listing.country,
                current_price: listing.currentPrice,
                description: listing.description,
                sub_title: listing.subTitle,
                title: listing.title,

                // Modified properties
                category: 'cat_' + listing.category,
                country_city: listing.country + '_' + listing.city,
                created_at: Date.now(),
                is_available: true,
                partition_key: 'listing_' + uuid.v4(),
                seller_id: 'seller_' + listing.userId,
                sort_key: 'listing'
            }
        };

        await dynamodb.putItem(params);
        return this.mapJsonToListing(params.Item);
    };

}