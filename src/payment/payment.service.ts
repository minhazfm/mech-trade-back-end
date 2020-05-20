import { CONSTANTS } from '../shared/constants';
// import { PPAccessToken } from '../interfaces/interfaces';

import * as paypal from '@paypal/checkout-server-sdk';

export class PaymentService {

    ppHttpClient: paypal.core.PayPalHttpClient;

    public constructor() {
        // Creating an environment
        let clientId = CONSTANTS.PP_CLIENT_ID;
        let clientSecret = CONSTANTS.PP_CLIENT_SECRET;
        let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        this.ppHttpClient = new paypal.core.PayPalHttpClient(environment);
    }

    public async captureOrder(orderId: string) {
        let request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        try {
            const response = await this.ppHttpClient.execute(request);
            return response;
        }
        catch (error) {
            console.log(`Capturing order error: ${error}`)
            throw new Error(error);
        }
    };

    public async createOrder(listingId: string) {
        // Construct a request object and set desired parameters
        // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
        let request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            custom_id: listingId,
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "150.00"
                    },
                    description: "SINGA V3, Blood Orange"
                }
            ]
        });

        try {
            // Call API with your client and get a response for your call
            const response = await this.ppHttpClient.execute(request);
            return response.result;
        }
        catch (error) {
            console.log(`Creating order error: ${error}`)
            throw new Error(error);
        }
    };

}