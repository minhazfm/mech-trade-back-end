import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../interfaces/interfaces';
import { PaymentService } from './payment.service';
import { ResponseBuilder } from '../shared/response-builder';

export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    public createOrder: ApiHandler = async (_event: ApiEvent, _context: ApiContext, callback: ApiCallback) => {
        try {
            const response = await this.paymentService.createOrder();
            return ResponseBuilder.success(response, callback);
        }
        catch (error) {
            return ResponseBuilder.serverError(error, callback); 
        }
    };

}