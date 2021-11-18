export interface IMapButtonGeneralProps {
    state: any;
    changeState: (state: any) => void;
    getTitle: (state: any) => string;
    isDisabled: (state: any) => boolean;
    styleName: string;
}

export interface IMapButtonGeneralState { }

export interface IMapButtonAddTreeProps {
    mapState: number;
    setMapState: (state: number) => void;
}

export interface IMapButtonAddTreeState { }
