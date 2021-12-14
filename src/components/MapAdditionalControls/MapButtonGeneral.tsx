import React from 'react';
import { IMapButtonGeneralProps } from "./types";


const MapButtonGeneral = React.forwardRef<HTMLButtonElement, IMapButtonGeneralProps>(
    ({state, changeState, getTitle, isDisabled, styleName} : IMapButtonGeneralProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
        <button
            ref={ref}
            disabled={isDisabled(state)}
            className={styleName}
            onClick={() => changeState(state)}>
            {getTitle(state)}
        </button>
    )
})

export default MapButtonGeneral;
