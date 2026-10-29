import { environment } from "../../../environments/environment";

export class ApiManifest {

    static readonly IDENTITY = {
        TOKEN: `${environment.API_BASE_URL}/identity-service/v1/sign-in`,
        GENERATE_CODE: `${environment.API_BASE_URL}/identity-service/v1/generate-code`,
        USER: `${environment.API_BASE_URL}/identity-service/v1/users`,
    };

    static readonly BUSINESS = {
        SCHEDULE: `${environment.BUSINESS_API_BASE_URL}/business-service/v1/schedule`,
        ZONE: `${environment.BUSINESS_API_BASE_URL}/business-service/v1/zones`,
        DINING_TABLE: `${environment.BUSINESS_API_BASE_URL}/business-service/v1/dining-tables`,
    };

    static readonly CUSTOMER = {
        CUSTOMER: `${environment.CUSTOMER_API_BASE_URL}/customer-service/v1/customers`,
    };

}
