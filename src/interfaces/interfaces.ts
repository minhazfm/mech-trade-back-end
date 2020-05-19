import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda';

// Standardize 'aws-lambda' implementation
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback) => void;
export type ApiResponse = ProxyResult;

export interface CreateListingComment {
    listingId: string;
    message: string;
    userId: string;
};

export interface ListingComment {
    createdAt: number;
    id: string;
    listingId: string;
    message: string;
    userId: string;
};

export interface Listing {
    category: string;
    city: string;
    country: string;
    createdAt: number;
    currentPrice: string;
    description: string;
    id: string;
    isAvailable: boolean;
    sellerId: string;
    subTitle: string;
    title: string;
};

export interface ListingImage {
    contentType: string;
    data: any;
    fileName: string;
};

export interface CreateListing {
    category: string;
    city: string;
    country: string;
    currentPrice: string;
    description: string;
    // listingId: string;
    subTitle: string;
    title: string;
    userId: string;
};

export interface CreateUser {
    firstName: string;
    lastName: string;
    userId: string;
};

export interface PPAccessToken {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
};

export interface User {
    buyerId: string;
    createdAt: number;
    firstName: string;
    isOnline: boolean;
    lastName: string;
    sellerId: string;
    userId: string;
};