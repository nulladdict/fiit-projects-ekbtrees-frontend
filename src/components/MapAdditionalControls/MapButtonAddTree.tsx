import React from 'react';
import {MapState} from "../Map/MapState";
import styles from './MapButtonStyles.module.css';
import {IMapButtonAddTreeProps} from "./types";


const MapButtonAddTree = React.forwardRef<HTMLButtonElement, IMapButtonAddTreeProps>(({mapState, setMapState} : IMapButtonAddTreeProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const handleClick = () => {
        if (mapState === MapState.default) setMapState(MapState.addTreeBegin);
        if (mapState === MapState.addTreeSelected) setMapState(MapState.addTreeSubmit);
    }

    // Added a parameter, before that an external function variable was used
    const renderTitle = (mapState: number) => {
        if (mapState === MapState.default) return "Добавить дерево";
        if (mapState === MapState.addTreeBegin) return "Укажите точку на карте";
        if (mapState === MapState.addTreeSelected || mapState === MapState.addTreeSubmit) {
            return "Добавить";
        }
    }

    return (
        <button
            ref={ref}
            disabled={mapState === MapState.addTreeBegin}
            className={styles.mapButtonSuccess}
            onClick={handleClick}>
            {renderTitle(mapState)}
        </button>
    )
})

export default MapButtonAddTree;
