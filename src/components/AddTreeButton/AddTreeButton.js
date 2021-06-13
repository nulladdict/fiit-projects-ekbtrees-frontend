import { MapSate } from "../Map/MapState";
import styles from "./AddTreeButton.module.css";

export const AddTreeButton = ({mapState, setMapState}) => {
    return(
        <button disabled={mapState === MapSate.addTreeBegin}
            className={styles.addTreeButton}
            onClick={ () => buttonOnClickHandler(mapState, setMapState) }>{getButtonText(mapState)}</button>
    );
}

const buttonOnClickHandler = (mapSate, setMapState) => {
    if (mapSate === MapSate.default) {
        setMapState(MapSate.addTreeBegin);
    }
    if (mapSate === MapSate.addTreeSelected) {
        setMapState(MapSate.addTreeSubmit);
    }
}

const getButtonText = (mapSate) => {
    if (mapSate === MapSate.default) {
        return "Добавить дерево";
    }
    if (mapSate === MapSate.addTreeBegin) {
        return "Укажите точку на карте";
    }
    if (mapSate === MapSate.addTreeSelected) {
        return "Добавить";
    }
}
