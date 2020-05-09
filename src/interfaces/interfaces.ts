import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda';

// Standardize 'aws-lambda' implementation
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback) => void;
export type ApiResponse = ProxyResult;

export interface CreateListing {
    currentPrice: string;
    description: string;
    listingId: string;
    subTitle: string;
    title: string;
    userId: string;
};

export interface CreateUser {
    firstName: string;
    isOnline: boolean;
    lastName: string;
    userId: string;
};

export interface GetUser {
    createdAt: string;
    firstName: string;
    isOnline: boolean;
    lastName: string;
    userId: string;
};