import React from "react";
import * as H from "history";
import {IEditedTree, IFile, IMapPosition, IUser} from "../../common/types";


export interface IEditTreeFormProps {
    user: IUser | null;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
    setMapViewPosition: (position: IMapPosition) => void;
    history: H.History;
}

export interface IEditTreeFormState {
    tree: IEditedTree | null;
    loading: boolean;
    files: IFile[];
    loadingFiles: boolean;
    uploadingFiles: boolean;
    images: IFile[];
    uploadingImages: boolean;
    modalShow: boolean;
    modalMessage?: string;
    successfullyEdited?: boolean;
    errors: {[key: string]: string}
    [key: string]: any;
}
