
import { body } from "express-validator";

export default [
    body('email')
    .notEmpty()
    .withMessage('E-mail is verplischt veld')
    .isEmail()
    .bail()
    //.isLength({min:6 , max: 36})
    .normalizeEmail()
    .withMessage('E-mail is niet goed'),
    body('password')
    .isLength({min: 6})
    .withMessage('wachtword is 6 karakters'),
]