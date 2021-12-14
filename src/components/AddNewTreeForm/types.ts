import {RouteComponentProps} from "react-router";
import * as H from "history";
import {IFile, IMapPosition, INewTree, IUser} from "../../common/types";

export interface IAddNewTreeFormRouterProps {
    lat: string;
    lng: string;
}
export interface IAddNewTreeFormProps extends RouteComponentProps<IAddNewTreeFormRouterProps> {
    user?: IUser | null;
    history: H.History;
    setMapViewPosition: (position: IMapPosition) => void;
}

export interface IAddNewTreeFormState {
    tree: INewTree;
    files?: IFile[];
    images?: IFile[];
    uploadingFiles?: boolean;
    uploadingImages?: boolean;
    modalShow: boolean;
    modalMessage?: string;
    successfullyAdded?: boolean;
    errors: {[key: string]: string}
}

