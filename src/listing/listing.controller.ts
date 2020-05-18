import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateListing, Listing, ListingComment, CreateListingComment, ListingImage } from '../interfaces/interfaces';
import { ListingService } from './listing.service';
import { ResponseBuilder } from '../shared/response-builder';

import { CONSTANTS } from '../shared/constants';
import * as Busboy from 'busboy';
import { S3 } from 'aws-sdk';

import { promises as fs } from 'fs';
import { join } from 'path';
import * as uuid from 'uuid';

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

    public addListingImages: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        // const test = multipart.parse(event, false)
        // console.log('Test ', test);

        let headers = event.headers;
        const modifiedHeaders = Object.keys(headers).reduce((newHeaders, key) => {
            newHeaders[key.toLowerCase()] = headers[key];
            return newHeaders;
        }, {});
        console.log('Headers ', modifiedHeaders);

        let images: Array<ListingImage> = [];

        let parseResult = {
            files: []
        };

        const processData: Promise<Array<ListingImage>> = new Promise((resolve, reject) => {
            const busboy = new Busboy({ 
                headers: modifiedHeaders, 
                limits: {
                    files: 5,
                    fileSize: 750000 // In bytes, 750Kb
                } 
            });

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                console.log('Once?');
                file.on('data', data => {
                    images.push({
                        contentType: mimetype,
                        data: data,
                        fileName: 'img_' + uuid.v1() + '.jpeg'
                    });
                });
            });

            busboy.on('field', (fieldname, value) => {
                try {
                    parseResult[fieldname] = JSON.parse(value);
                } catch (err) {
                    parseResult[fieldname] = value;
                }
            });

            busboy.on('error', error => reject(`Parse error: ${error}`));
            busboy.on('finish', () => {
                // event.body = parseResult;
                resolve(images);
            });
        
            busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();
        });

        const processDataResult = await processData;

        const s3 = new S3({
            s3ForcePathStyle: true,
            accessKeyId: CONSTANTS.S3_ACCESS_KEY_ID,
            secretAccessKey: CONSTANTS.S3_SECRET_ACCESS_KEY,
            endpoint: CONSTANTS.S3_ENDPOINT
        });

        const listingId: string = event.pathParameters.id;

        const allImagesPromises = processDataResult.map(eachFile => {
            return s3.upload({
                ACL: 'public-read',
                Bucket: CONSTANTS.S3_BUCKET,
                Key: listingId + '/' + eachFile.fileName,
                Body: eachFile.data
            }).promise()
            // return fs.writeFile(join(process.cwd(), 'src', 'listing', eachFile.fileName), eachFile.data, 'binary')
        })

        await Promise.all(allImagesPromises)
            .then((response: Array<S3.ManagedUpload.SendData>) => {
                const result = {
                    success: true,
                    imageUrls: response.map(value => value.Location)
                };
                // const imageUrls: Array<string> = response.map(value => value.Location)
                return ResponseBuilder.success(result, callback); 
            });
        // await fs.writeFile(join(process.cwd(), 'src', 'listing', 'test.jpeg'), data, 'binary')
                        // .then(() => { resolve() });

        // return this.listingService.addImages(listingId)
        //     .then((response: boolean) => {
        //         const result = {
        //             success: response
        //         };
                // return ResponseBuilder.success(result, callback); 
            // })
            // .catch(error => {
            //     return ResponseBuilder.serverError(error, callback); 
            // });
    };

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
        const listingId = event.pathParameters.id;

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