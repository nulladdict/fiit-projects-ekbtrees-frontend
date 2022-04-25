import { Component } from "react";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import {IClusterMarkerProps, IClusterMarkerState} from "./types";


export default class ClusterMarker extends Component<IClusterMarkerProps, IClusterMarkerState> {
    constructor(props: IClusterMarkerProps) {
        super(props);
    }

    render() {
        const markerIcon = divIcon({
            html: '<div><span>' + this.props.count + '</span></div>',
            className: "circle-div-icon",
            iconSize: [40, 40]
        });

        return (<Marker
            position={this.props.position}
            icon={ markerIcon }
        />);
    }
}
