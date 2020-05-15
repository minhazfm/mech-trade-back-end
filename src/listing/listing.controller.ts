import { ApiCallback, ApiContext, ApiEvent, ApiHandler, CreateListing, Listing, ListingComment, CreateListingComment } from '../interfaces/interfaces';
import { ListingService } from './listing.service';
import { ResponseBuilder } from '../shared/response-builder';

import * as Busboy from 'busboy';
import { promises as fs } from 'fs';
import { join } from 'path';

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

        let parseResult = {
            files: []
        };

        const result = new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: modifiedHeaders });

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                console.log('Once?');

                file.on('data', data => {

                    return fs.writeFile(join(process.cwd(), 'src', 'listing', 'test.jpeg'), data, 'binary')
                        .then(() => { resolve() });
                    parseResult.files.push({
                        file: data,
                        fileName: filename,
                        contentType: mimetype
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
                resolve(parseResult);
            });
        
            busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();

            // setTimeout(() => {
            //     resolve();
            // }, 3000);
        });
        await result;
        // const cwd = process.cwd();
        // await fs.writeFile(join(cwd, 'src', 'listing', 'test.jpeg'), event.body);
        // console.log('See ', parseResult.files.length)

        const listingId: string = event.pathParameters.id;

        return this.listingService.addImages(listingId)
            .then((response: boolean) => {
                const result = {
                    success: response
                };
                return ResponseBuilder.success(result, callback); 
            })
            .catch(error => {
                return ResponseBuilder.serverError(error, callback); 
            });
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