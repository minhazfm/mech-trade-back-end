import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda';

// Type aliases to hide the 'aws-lambda' implementation
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback) => void;
export type ApiResponse = ProxyResult;

export interface CreateUser {
    isOnline: boolean;
    name: string;
    userId: string;
};

export interface GetUser {
    createdAt: string;
    isOnline: boolean;
    name: string;
    userId: string;
};