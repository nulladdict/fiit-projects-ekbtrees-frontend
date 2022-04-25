import * as H from "history";
import {IUser} from "../../common/types";


export interface IRegistrationFormProps {
    user: IUser | null;
    history: H.History;
}

export interface IRegistrationFormState {
    touchStart: any;
    error: boolean;
    errorMail: boolean;
}

export interface IRegistrationFormInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
