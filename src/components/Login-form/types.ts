import * as H from "history";
import {ILogingFormUser} from "../../common/types";


export interface ILoginFormProps {
    history: H.History;
    handleCookie: any; // seems to be unused
}

export interface ILoginFormState {
    touchStart: number | null;
    logged: boolean;
    user: ILogingFormUser;
    error: boolean;
}
