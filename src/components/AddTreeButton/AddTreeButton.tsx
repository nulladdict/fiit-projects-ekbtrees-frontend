
import { MapState } from "../Map/MapState";
import styles from "./AddTreeButton.module.css";
import {IAddTreeButtonProps} from "./types";

export const AddTreeButton = ({mapState, setMapState}: IAddTreeButtonProps) => {
    return(
        <button disabled={mapState === MapState.addTreeBegin}
            className={styles.addTreeButton}
            onClick={ () => buttonOnClickHandler(mapState, setMapState) }>{getButtonText(mapState)}</button>
    );
}

const buttonOnClickHandler = (mapState: number, setMapState: (state: number) => void) => {
    if (mapState === MapState.default) {
        setMapState(MapState.addTreeBegin);
    }
    if (mapState === MapState.addTreeSelected) {
        setMapState(MapState.addTreeSubmit);
    }
}

const getButtonText = (mapState: number) => {
    if (mapState === MapState.default) {
        return "Добавить дерево";
    }
    if (mapState === MapState.addTreeBegin) {
        return "Укажите точку на карте";
    }
    if (mapState === MapState.addTreeSelected) {
        return "Добавить";
    }
}
