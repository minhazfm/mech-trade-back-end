import { CreateListing, CreateListingComment, Listing, ListingComment } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';
import * as uuid from 'uuid';

export class ListingService {

    public constructor() {

    }

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

    public async getAllListings(): Promise<any> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            // IndexName: CONSTANTS.DYNAMODB_LISTINGS_TABLE_GSI1,
            KeyConditionExpression: 'partition_key = :partition_key',
            ExpressionAttributeValues: {
                ':sort_key': 'listing'
            }
        };

        return await dynamodb.queryItem(params);
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
            return {
                category: result.Item.category,
                city: result.Item.city,
                country: result.Item.country,
                createdAt: result.Item.created_at,
                currentPrice: result.Item.current_price,
                description: result.Item.description,
                id: result.Item.id,
                sellerId: result.Item.seller_id,
                subTitle: result.Item.sub_title,
                title: result.Item.title
            };
        }
        else {
            throw new Error('Listing not found')
        }
    };

    public async putListing(listing: CreateListing): Promise<Listing> {
        let newListing: Listing = {
            category: 'cat_' + listing.category,
            city: listing.city,
            country: listing.country,
            createdAt: Date.now(),
            currentPrice: listing.currentPrice,
            description: listing.description,
            id: 'listing_' + uuid.v4(),
            sellerId: 'seller_' + listing.userId,
            subTitle: listing.subTitle,
            title: listing.title
        };

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

        await dynamodb.putItem(params);
        return newListing;
    };

}