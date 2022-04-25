import React from "react";
import styles from "./Spinner.module.css";
import CircularProgress from '@material-ui/core/CircularProgress';


export const Spinner = () => {
    return (
        <div className={styles.spinner}>
            <CircularProgress color="primary" size={70}/>
        </div>
    )
}

export default Spinner;
