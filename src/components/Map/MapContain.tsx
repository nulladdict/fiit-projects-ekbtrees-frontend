import React, {useEffect, useRef} from "react";
import {useState} from "react";
import GeojsonLayer from "./GeojsonLayer";
import {MapState} from "./MapState";
import "./Map.css";
import {IMapContainProps} from "./types";


const DG = require('2gis-maps');


const MapContain = (props: IMapContainProps) => {
	const {user} = props;

	const defaultPosition = [56.8391040, 60.6082500]; // Yekaterinburg position
	const [map, setMap] = useState<any>(); // for 2-gis map
	const [mapState, setMapState] = useState<number>(MapState.default);
	const elRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let innerMap = map;
		if (!innerMap) {
			innerMap = DG.map(elRef.current, {
				'center': defaultPosition,
				'zoom': 14
			});
			setMap(innerMap)
		} else {
			innerMap.setView(defaultPosition)
		}
	}, [])

	return (
		<div ref={elRef} className={props.className}>
			<GeojsonLayer
				map={map}
				mapState={mapState}
				setMapState={setMapState}
				user={user} />
		</div>
	);
};

export default MapContain;
