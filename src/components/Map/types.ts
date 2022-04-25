import {IGeographicalPoint, IMapPosition, ITreePropertyValue, IUser} from "../../common/types";


export interface ILatLng {
    lat: number;
    lng: number;
}

export interface IJsonMapTree {
    id: number;
    geographicalPoint: IGeographicalPoint;
    diameterOfCrown: number;
    species: ITreePropertyValue;
}

export interface IJsonMapTreeCluster {
    id: number;
    centre: IGeographicalPoint;
    count: number;
}


export interface IMapDataSeparateTrees {
    isClusterData: false;
    json: IJsonMapTree[];
}

export interface IMapDataClustered {
    isClusterData: true;
    json: IJsonMapTreeCluster[];
}

export interface ICircleOptions {
    fillColor: string;
    color: string;
}

export interface IGeojsonLayerProps {
    user: IUser | null;
    map: any; // 2-gis map
    mapState: number;
    setMapState: any; // 2-gis map setter
    // mapViewPosition?: [number, number];
    setMapViewOnUser: boolean;
    pointerMarker?: IMapPosition;
}

export interface IGeojsonLayerState {}

export type MapContainerCoords = [
    {lat: number, lng: number},
    {lat: number, lng: number}
];

export interface IGeolocationCoords {
    latitude: number;
    longitude: number;
    accuracy: number;
}


export interface IMapContainProps {
    user: IUser | null;
    className?: string;
    styleName?: string;
    mapViewPosition?: IMapPosition;
    setMapViewPosition: (position: IMapPosition | undefined) => void;
}

export interface IMapContainState { }
