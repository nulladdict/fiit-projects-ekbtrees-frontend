import React, {useEffect, useRef} from "react";
import {useState} from "react";
import GeojsonLayer from "./GeojsonLayer";
import {MapState} from "./MapState";
import "./Map.css";
import {IMapContainProps} from "./types";
import mapIcon from "../../common/images/map_marker.png";

const DG = require('2gis-maps');


const MapContain = (props: IMapContainProps) => {
	const {styleName, mapViewPosition, setMapViewPosition, user} = props;

	const defaultPosition = [56.8391040, 60.6082500]; // Yekaterinburg position
	const defaultZoom = 14; // Yekaterinburg position
	const [map, setMap] = useState<any>(); // for 2-gis map
	const [mapState, setMapState] = useState<number>(MapState.default);
	const elRef = useRef<HTMLDivElement>(null);
	const setMapViewOnUser = useRef<boolean>(true);
	const setMarkerOnView = useRef<boolean>(false);

	let position = mapViewPosition ? [mapViewPosition.lat, mapViewPosition.lng]  : defaultPosition;
	let zoom = mapViewPosition ? 30 : defaultZoom;
	useEffect(() => {
		setMapViewOnUser.current = mapViewPosition === undefined;

		if (mapViewPosition) {
			// console.log(`New setMarkerOnView: ${!!mapViewPosition.marker}`);
			setMarkerOnView.current = !!mapViewPosition.marker;
		}
		// console.log(`New setMarkerOnView: ${setMarkerOnView.current}`);
		let innerMap = map;
		if (!innerMap) {
			innerMap = DG.map(elRef.current, {
				'center': position,
				'zoom': zoom
			});
			setMap(innerMap);
		} else {
			innerMap.setView(position, zoom);
		}
		setMapViewPosition(undefined);
	}, []);

	return (
		<div ref={elRef} className={props.className}>
			<GeojsonLayer
				map={map}
				mapState={mapState}
				setMapState={setMapState}
				// mapViewPosition={props.mapViewPosition}
				setMapViewOnUser={setMapViewOnUser.current}
				// setMarkerOnView={setMarkerOnView.current}
				pointerMarker={mapViewPosition}
				user={user} />
		</div>
	);
};

export default MapContain;
