import {IUser} from "../../common/types";


export interface IMainProps {
    user: IUser | null;
    onCookie: any; // seems to be unused
}

export interface IMainState {
    mapViewPosition?: [number, number];
}
