import {IFile, IMapPosition, ITreeModelConverted, IUser} from "../../common/types";
import * as H from "history";


export interface ITreeProps {
    user: IUser | null;
    setMapViewPosition: (position: IMapPosition) => void;
    history: H.History;
}

export interface ITreeState {
    tree: ITreeModelConverted | null;
    loading: boolean;
    files: IFile[];
    images: IFile[];
    loadingFiles: boolean;
    modalShow: boolean;
    successfullyDeleted?: boolean;
}
