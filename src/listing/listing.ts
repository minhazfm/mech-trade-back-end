import { ApiHandler } from '../interfaces/interfaces';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

const listingService: ListingService = new ListingService();
const listingController: ListingController = new ListingController(listingService);

export const createListing: ApiHandler = listingController.createListing;
export const getListing: ApiHandler = listingController.getListing;