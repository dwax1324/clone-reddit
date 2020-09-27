"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [{
                field: "email",
                message: "invalid email format"
            }];
    }
    if (options.username.length <= 4) {
        return [
            {
                field: "username",
                message: "length must be greater than 4"
            }
        ];
    }
    if (options.password.length <= 4) {
        return [{
                field: "password",
                message: "length must be greater than 4"
            }];
    }
    if (options.username.includes('@')) {
        return [{
                field: "username",
                message: "cannot include @"
            }];
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map