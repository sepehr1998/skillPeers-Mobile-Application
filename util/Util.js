export function getServerErrorMessage(error) {
    if (!error || !error.errorCode) return undefined;
    switch (error.errorCode) {
        case 2101:
        case 2089:
            return "Invalid request token.";
        case 3001:
            return "User not exist";
        case 3003:
            return "Wrong password";
        case 3011:
            return "Username already exist";
        case 3014:
            return "Email already exist in system";
        case 3020:
            return "Invalid registration code.";
        case 3021:
            return "Email not exist in system";
        case 3022:
            return "Wrong password";
        case 3032:
            return "Email already exist in system";
        case 3025:
            return "Email not exist in system";
        case 3026:
            return "Invalid registration code.";
        case 2414:
            return "Email already exist in system";
        case 1201:
            return "Requested data not exist.";
        default:
            return "Some parmeters are invalid";
    }
}


export function getHttpErrorMessage(error) {
    switch (error.status) {
        case 404:
            return "Not Found.";
        case 504:
            return "Time out.";
        case 503:
            return "Service Unavailable";
        case 500:
            return "Some Problem while connecting server.";
        default:
            return "Unkown error while sending request.";
    }
}