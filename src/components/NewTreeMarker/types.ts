import {LatLng, LatLngExpression} from "leaflet";


export interface INewTreeMarkerProps {
    position: LatLngExpression;
    setPosition: (latleng: LatLng) => void;
}

export interface INewTreeMarkerState { }
