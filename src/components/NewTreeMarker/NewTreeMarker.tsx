import { Marker } from 'react-leaflet';
import {icon, LeafletEventHandlerFnMap, Marker as LeafletMarker} from 'leaflet';
import {useRef, useMemo, ForwardRefExoticComponent, RefAttributes} from "react";
import "./NewTreeMarker.css";
import markerIcon1x from '../../img/marker-icon.png';
import markerIcon2x from '../../img/marker-icon-2x.png';
import {INewTreeMarkerProps} from "./types";


export const NewTreeMarker = ({position, setPosition, ...props }: INewTreeMarkerProps) => {
    const markerIcon = icon({
        iconUrl: markerIcon1x,
        iconRetinaUrl: markerIcon2x,
        iconSize: [25, 41],
    });
    const markerRef = useRef<any>(null);
    const eventHandlers: LeafletEventHandlerFnMap = useMemo(
        () => ({
            dragend() {
                const marker: LeafletMarker | null = markerRef.current;
                if (marker != null) {
                    setPosition(marker.getLatLng())
            }
          },
        }),
      [],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={ markerIcon }
            { ...props } />
    )
}
