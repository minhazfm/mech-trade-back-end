import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../interfaces/interfaces';
import { PaymentService } from './payment.service';
import { ResponseBuilder } from '../shared/response-builder';

export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    public captureOrder: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        try {
            const orderId: string = event.pathParameters.id;
            
            const response = await this.paymentService.captureOrder(orderId);
            return ResponseBuilder.success(response, callback);
        }
        catch (error) {
            return ResponseBuilder.serverError(error, callback); 
        }
    };

    public createOrder: ApiHandler = async (event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        try {
            const listingId: string = event.pathParameters.id;

            const response = await this.paymentService.createOrder(listingId);
            return ResponseBuilder.success(response, callback);
        }
        catch (error) {
            return ResponseBuilder.serverError(error, callback); 
        }
    };

}