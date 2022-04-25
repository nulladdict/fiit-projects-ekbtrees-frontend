import React from 'react';
import {MapState} from "../Map/MapState";
import styles from './MapButton.module.css';
import {IMapButtonProps} from "./types";


const MapButton = React.forwardRef<HTMLButtonElement, IMapButtonProps>(({mapState, setMapState} : IMapButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
	const handleClick = () => {
		if (mapState === MapState.default) {
			setMapState(MapState.addTreeBegin);
		}
		if (mapState === MapState.addTreeSelected) {
			setMapState(MapState.addTreeSubmit);
		}
	}

	// Added a parameter, before that an external function variable was used
	const renderTitle = (mapState: number) => {
		if (mapState === MapState.default) {
			return "Добавить дерево";
		}
		if (mapState === MapState.addTreeBegin) {
			return "Укажите точку на карте";
		}
		if (mapState === MapState.addTreeSelected || mapState === MapState.addTreeSubmit) {
			return "Добавить";
		}
	}

	return (
		<button
			ref={ref}
			disabled={mapState === MapState.addTreeBegin}
			className={styles.mapButton}
			onClick={handleClick}>
			{renderTitle(mapState)}
		</button>
	)
})

export default MapButton;
