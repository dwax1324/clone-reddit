import { UsernamePasswordInput } from "./UsernamePasswordInput"

export const validateRegister = (options: UsernamePasswordInput) => {
    
            
        if (!options.email.includes('@')) {
            return [{
                    field: "email",
                    message: "invalid email format"
            }]
        }
         // 아이디 글자수 제한
        if (options.username.length <= 4) {
            return[
                {
                    field: "username",
                    message: "length must be greater than 4"

                }
            ]
        }

        // 비번 글자수 제한

        if (options.password.length <= 4) {
            return [{
                    field: "password",
                    message: "length must be greater than 4"

            
            }]
        }
        // 이메일 골뱅이 체크
        
        if (options.username.includes('@')) {
            return [{
                    field: "username",
                    message: "cannot include @"
            }]
        }
    return null;
}