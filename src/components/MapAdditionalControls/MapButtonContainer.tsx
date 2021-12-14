import React from 'react';
import styles from './MapButtonStyles.module.css';

const MapButtonContainer: React.FC = (props) => {
        return (
            <div className={styles.mapButtonContainer}>
                {props.children}
            </div>
        );
    }

export default MapButtonContainer;