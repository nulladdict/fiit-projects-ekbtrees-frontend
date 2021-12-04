import {ChangeEvent, ReactNode} from "react";
import {ITreeProperty} from "../../common/types";


export interface ISelectProps {
    id: string;
    item: ITreeProperty;
    onChange: (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child?: ReactNode) => void;
    onOpen: (event: ChangeEvent<{}>) => void;
    required?: boolean;
}

export interface ISelectState { }

export interface ISelectOption {
    id: string | number;
    title: string;
}