import { IMapPosition, IUser } from "../../common/types";


export interface IMainProps {
    user: IUser | null;
    onCookie: any; // seems to be unused
    theme: string;
}

export interface IMainState {
    mapViewPosition?: IMapPosition
}
