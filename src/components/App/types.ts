import {IUser} from "../../common/types";
import * as H from "history";

export interface IAppProps {
    history: H.History;
}

export interface IAppState {
    user: IUser | null;
    theme: string;
}
