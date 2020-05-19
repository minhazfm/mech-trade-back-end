import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONSTANTS } from '../shared/constants';
import { PPAccessToken } from '../interfaces/interfaces';

import * as paypal from '@paypal/checkout-server-sdk';
import * as querystring from 'querystring';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {

    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });

        this._initializeResponseInterceptor();
    }

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    protected _handleError = (error: any) => Promise.reject(error);

}

export class PaymentService extends HttpClient {

    public constructor() {
        super(CONSTANTS.PP_ENDPOINT);
    }

    // public async getAccessToken() {
    //     const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    //     return response.data;
    // };

    public async createOrder() {
        // Creating an environment
        let clientId = CONSTANTS.PP_CLIENT_ID;
        let clientSecret = CONSTANTS.PP_CLIENT_SECRET;
        let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        let client = new paypal.core.PayPalHttpClient(environment);

        // Construct a request object and set desired parameters
        // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
        let request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "150.00"
                    },
                    "description": "SINGA V3, Blood Orange"
                }
            ]
        });

        try {
            // Call API with your client and get a response for your call
            const response = await client.execute(request);
            return response.result;
        }
        catch (error) {
            console.log(`Creating order error: ${error}`)
            throw new Error(error);
        }
    };

    // public async getAccessToken(): Promise<PPAccessToken> {
    //     try {
    //         const config: AxiosRequestConfig = {
    //             auth: {
    //                 username: CONSTANTS.PP_CLIENT_ID,
    //                 password: CONSTANTS.PP_CLIENT_SECRET
    //             },
    //             data: querystring.stringify({
    //                 grant_type: 'client_credentials'
    //             }),
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Accept-Language': 'en_US',
    //                 // 'Access-Control-Allow-Credentials': true,
    //                 // 'Authorization': 'Basic ' + new Buffer(CONSTANTS.PP_CLIENT_ID + ':' + CONSTANTS.PP_CLIENT_SECRET).toString('base64'),
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             },
    //             responseType: 'json',
    //             withCredentials: true
    //         };

    //         const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', config);
    //         // const response = await this.instance.post('/v1/oauth2/token', config);
    //         return {
    //             accessToken: response.access_token,
    //             expiresIn: response.expires_in,
    //             tokenType: response.token_type
    //         };
    //     }
    //     catch (error) {
    //         console.log('Access token error', error.message);
    //         throw new Error(error);
    //     }
    // };

}