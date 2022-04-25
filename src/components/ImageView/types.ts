import {RouteComponentProps} from "react-router";
import {IFile} from "../../common/types";


export interface IImageViewRouteProps {
    id: string;
}

export interface IImageViewProps extends RouteComponentProps<IImageViewRouteProps>{
}

export interface IImageViewState {
    imageData: IFile | null;
}
