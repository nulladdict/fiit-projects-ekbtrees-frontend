import * as H from "history";
import {IJsonTreeWithImage, IUser} from "../../common/types";


export interface ITreeListsTreeTable {
    age: string;
    creationDate: string;
    height: string;
    image: string;
    species: string;
}

export interface ITreeListsStateLocale {
    treeTable: ITreeListsTreeTable;
}

export interface ITreeListsProps {
    user: IUser | null;
    history: H.History;
}

export interface ITreeListsState {
    currentPage: number;
    treeCountPerPage: number;
    trees: IJsonTreeWithImage[];
    loading: boolean;
}
