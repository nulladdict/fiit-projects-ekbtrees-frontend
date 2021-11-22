import {RouteComponentProps} from "react-router";
import * as H from "history";
import {IFile, INewTree} from "../../common/types";

export interface IAddNewTreeFormRouterProps {
    lat: string;
    lng: string;
}
export interface IAddNewTreeFormProps extends RouteComponentProps<IAddNewTreeFormRouterProps> {
    history: H.History;
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
}

