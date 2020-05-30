import { ApiEvent, CreateListing, CreateListingComment, Listing, ListingComment, ListingImage } from '../interfaces/interfaces';
import { CONSTANTS } from '../shared/constants';
import { dynamodb } from '../shared/dynamo-db';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { S3 } from 'aws-sdk';
import * as Busboy from 'busboy';
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
            imageUrls: json.image_urls ?? [],
            isAvailable: json.is_available,
            sellerId: json.seller_id,
            subTitle: json.sub_title,
            title: json.title
        };
    };

    public async addImages(listingId: string) {
        const s3 = new S3({
            s3ForcePathStyle: true,
            accessKeyId: CONSTANTS.S3_ACCESS_KEY_ID,
            secretAccessKey: CONSTANTS.S3_SECRET_ACCESS_KEY,
            endpoint: CONSTANTS.S3_ENDPOINT
        });

        try {
            const response = await s3.putObject({
                Bucket: CONSTANTS.S3_BUCKET,
                Key: listingId + '/img_' + uuid.v1(),
                Body: new Buffer('abcd')
            }).promise();
            console.log('Response: ', response.ETag);
            return true;
        }
        catch (error) {
            console.log('Error: ', error.message);
            return false;
        }
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

    public processFormData(event: ApiEvent): Promise<CreateListing> {
        let headers = event.headers;
        const modifiedHeaders = Object.keys(headers).reduce((newHeaders, key) => {
            newHeaders[key.toLowerCase()] = headers[key];
            return newHeaders;
        }, {});

        let newListing: any = {
            images: []
        };

        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ 
                headers: modifiedHeaders, 
                limits: {
                    files: 5,
                    fileSize: 750000 // In bytes, 750Kb
                } 
            });

            busboy.on('file', (_fieldname, file, _filename, _encoding, mimetype) => {
                file.on('data', data => {
                    newListing.images.push({
                        contentType: mimetype,
                        data: data,
                        fileName: 'img_' + uuid.v1() + '.jpeg'
                    });
                });
            });

            busboy.on('field', (fieldname, value) => {
                newListing[fieldname] = value;
            });

            busboy.on('error', (error: any) => {
                reject(`Processing image data error: ${error}`)
            });

            busboy.on('finish', () => {
                resolve(newListing);
            });
        
            busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();
        });
    };

    public processImageData(event: ApiEvent): Promise<Array<ListingImage>> {
        let headers = event.headers;
        const modifiedHeaders = Object.keys(headers).reduce((newHeaders, key) => {
            newHeaders[key.toLowerCase()] = headers[key];
            return newHeaders;
        }, {});

        let images: Array<ListingImage> = [];

        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ 
                headers: modifiedHeaders, 
                limits: {
                    files: 5,
                    fileSize: 750000 // In bytes, 750Kb
                } 
            });

            busboy.on('file', (_fieldname, file, _filename, _encoding, mimetype) => {
                file.on('data', data => {
                    images.push({
                        contentType: mimetype,
                        data: data,
                        fileName: 'img_' + uuid.v1() + '.jpeg'
                    });
                });
            });

            // busboy.on('field', (fieldname, value) => {
            //     try {
            //         parseResult[fieldname] = JSON.parse(value);
            //     } catch (err) {
            //         parseResult[fieldname] = value;
            //     }
            // });

            busboy.on('error', (error: any) => {
                reject(`Processing image data error: ${error}`)
            });

            busboy.on('finish', () => {
                resolve(images);
            });
        
            busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();
        });
    };

    public async putListing(listing: CreateListing): Promise<Listing> {
        const params = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Item: {
                category: listing.category,
                city: listing.city,
                country: listing.country,
                current_price: listing.currentPrice,
                description: listing.description,
                sub_title: listing.subTitle,
                title: listing.title,

                // Modified properties
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

    private async updateListingImages(imageUrls: Array<string>, listingId: string) {
        const params: DocumentClient.UpdateItemInput = {
            TableName: CONSTANTS.DYNAMODB_LISTINGS_TABLE,
            Key: {
                partition_key: listingId,
                sort_key: 'listing'
            },
            ExpressionAttributeValues: {
                ':IU': imageUrls
            },
            UpdateExpression: 'set image_urls = :IU'
        };

        return await dynamodb.updateItem(params);
    };

    public async saveImages(images: Array<ListingImage>, listingId: string) {
        const s3 = new S3({
            s3ForcePathStyle: true,
            accessKeyId: CONSTANTS.S3_ACCESS_KEY_ID,
            secretAccessKey: CONSTANTS.S3_SECRET_ACCESS_KEY,
            endpoint: CONSTANTS.S3_ENDPOINT
        });

        const allImagePromises = images.map(eachFile => {
            return s3.upload({
                ACL: 'public-read',
                Bucket: CONSTANTS.S3_BUCKET,
                Key: listingId + '/' + eachFile.fileName,
                Body: eachFile.data
            }).promise()
        });

        try {
            const saveImages = await Promise.all(allImagePromises);
            const saveImageUrls = saveImages.map(value => value.Location);
            await this.updateListingImages(saveImageUrls, listingId);
            return saveImageUrls;
        }
        catch (error) {
            throw new Error(`Save image error: ${error}`)
        }
    };

}