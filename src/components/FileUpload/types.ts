import {IFile} from "../../common/types";


export interface IFileUploadProps {
    onDelete?: (id: string | number) => void;
    onUpload?: (files: File[]) => void;
    files: IFile[];
    uploading?: boolean;
    mode?: string;
    type?: string;
}

export interface IFileUploadState {
    open: boolean;
    modalOpen: boolean;
    modalData?: string | null;
}
