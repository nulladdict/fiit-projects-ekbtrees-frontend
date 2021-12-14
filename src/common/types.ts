
export interface IFile {
    id: number;
    title: string;
    mimeType: string;
    size?: number,
    uri: string;
    treeId?: 0;
}

export type FileGroupType = "files" | "images";


export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface ICookieAccess {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface ILogingFormUser {
    email: string | null;
    password: string | null;
}


export interface ITreePropertyValue {
    id: string | number;
    title: string;
}

export interface ITreeProperty {
    title?: string;
    value?: string | number;
    values?: ITreePropertyValue[];
    type?: 'string' | 'number';
    parse?: any;
    loading?: boolean;
    disabled?: boolean;
    validate?: (val: string | number | undefined) => string | null;
    required?: boolean;
}

export interface INewTree {
    latitude: ITreeProperty;
    longitude: ITreeProperty;
    conditionAssessment: ITreeProperty;
    age: ITreeProperty;
    diameterOfCrown: ITreeProperty;
    heightOfTheFirstBranch: ITreeProperty;
    numberOfTreeTrunks: ITreeProperty;
    treeHeight: ITreeProperty;
    speciesId: ITreeProperty;
    status: ITreeProperty;
    treePlantingType: ITreeProperty;
    trunkGirth: ITreeProperty;
    fileIds: number[];
}

export interface IEditedTree {
    id?: number;
    geographicalPoint?: IGeographicalPoint;
    species?: ITreeProperty;
    treeHeight?: ITreeProperty;
    numberOfTreeTrunks?: ITreeProperty;
    trunkGirth?: ITreeProperty;
    diameterOfCrown?: ITreeProperty;
    heightOfTheFirstBranch?: ITreeProperty;
    conditionAssessment?: ITreeProperty;
    age?: ITreeProperty;
    treePlantingType?: ITreeProperty;
    created?: ITreeProperty;
    updated?: ITreeProperty;
    authorId?: ITreeProperty;
    status?: ITreeProperty;
    fileIds?: (string | number)[];
}



export interface IGeographicalPoint {
    latitude: number | null;
    longitude: number | null;
}


export interface ITreePropertyConverted {
    title: string;
    value: string | number | boolean| null;
}

export interface ITreeModelConverted {
    id: number;
    created: ITreePropertyConverted;
    updated: ITreePropertyConverted;
    species: ITreePropertyConverted;
    latitude: ITreePropertyConverted;
    longitude: ITreePropertyConverted;
    conditionAssessment: ITreePropertyConverted;
    age: ITreePropertyConverted;
    diameterOfCrown: ITreePropertyConverted;
    heightOfTheFirstBranch: ITreePropertyConverted;
    numberOfTreeTrunks: ITreePropertyConverted;
    treeHeight: ITreePropertyConverted;
    // speciesId: TreePropertyConverted;
    status: ITreePropertyConverted;
    treePlantingType: ITreePropertyConverted;
    trunkGirth: ITreePropertyConverted;
}

export type ResourceAction = "uploadingFiles" | "uploadingImages";

export interface ITreeScpecies {
    id: number,
    title: string
}

export interface IJsonTree {
    id?: number;
    geographicalPoint?: IGeographicalPoint;
    species?: ITreePropertyValue;
    treeHeight?: number;
    numberOfTreeTrunks?: number;
    trunkGirth?: number;
    diameterOfCrown?: number;
    heightOfTheFirstBranch?: number;
    conditionAssessment?: any;
    age?: number;
    treePlantingType?: string;
    created?: number;
    updated?: number;
    authorId?: string;
    status?: string;
    fileIds?: number[];
    editable?: boolean;
    deletable?: boolean;
}


export interface IPostJsonTree {
    id?: number;
    geographicalPoint?: IGeographicalPoint;
    speciesId?: number;
    treeHeight?: number;
    numberOfTreeTrunks?: number;
    trunkGirth?: number;
    diameterOfCrown?: number;
    heightOfTheFirstBranch?: number;
    conditionAssessment?: any;
    age?: number;
    treePlantingType?: string;
    created?: number | string;
    updated?: number | string;
    authorId?: string;
    status?: string;
    fileIds?: number[];
}

export interface IJsonTreeWithImage extends  IJsonTree {
    image: string;
}


export type SimpleMathesSelectors =  'matches' | 'msMatchesSelector';

export interface IMapPosition {
    lat: number;
    lng: number;
    marker?: boolean;
}
