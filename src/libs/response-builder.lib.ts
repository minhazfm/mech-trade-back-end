import { ApiCallback, ApiResponse } from '@interfaces/interfaces';
import { AWSError } from 'aws-sdk';

export const ErrorCode = {
    GeneralError: 'GENERAL_ERROR',
    InvalidId: 'INVALID_ID',
    InvalidName: 'INVALID_NAME',
    MissingEnv: 'MISSING_ENV',
    MissingId: 'MISSING_ID',
    MissingPermission: 'MISSING_PERMISSION'
};

export const HttpStatusCode = {
    BadRequest: 400,
    ConfigurationError: 500.19,
    Forbidden: 403,
    InternalServerError: 500,
    NotFound: 404,
    Success: 200
};

interface ErrorResponseBody {
    error: ErrorResult;
}

export abstract class ErrorResult extends Error {
    public constructor(public code: string, public description: string) {
        super(description);
    }
}

export class BadRequestResult extends ErrorResult {}

export class ConfigurationErrorResult extends ErrorResult {}

export class ForbiddenResult extends ErrorResult {}

export class InternalServerErrorResult extends ErrorResult {}

export class NotFoundResult extends ErrorResult {}

export class ResponseBuilder {

    private static _returnAs<T>(result: T, statusCode: number, callback: ApiCallback): void {
        const bodyObject: ErrorResponseBody | T = result instanceof ErrorResult ? { error: result } : result;
        const response: ApiResponse = {
            body: JSON.stringify(bodyObject),
            headers: {
                'Access-Control-Allow-Origin': '*'  // This is required to make CORS work with AWS API Gateway Proxy Integration.
            },
            statusCode
        };

        callback(undefined, response);
    }

    public static serverError(error: Error, callback: ApiCallback): void {
        let modifiedCode: string = error instanceof AWSError ? error.code : ErrorCode.GeneralError;
        const errorResult: InternalServerErrorResult = new InternalServerErrorResult(modifiedCode, error.message);
        ResponseBuilder._returnAs<InternalServerErrorResult>(errorResult, HttpStatusCode.InternalServerError, callback);
    }

    public static success<T>(result: T, callback: ApiCallback): void {
        ResponseBuilder._returnAs<T>(result, HttpStatusCode.Success, callback);
    }

}