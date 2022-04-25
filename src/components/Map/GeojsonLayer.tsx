import cn from 'classnames';
import {divIcon, icon} from 'leaflet';
import React, {useState, useEffect, useRef, useCallback, useLayoutEffect} from 'react';
import {Circle} from 'react-leaflet';
import markerIcon from './markerIcon';
import {getCircleOptions, getCircleRadius} from "./MapHelpers";
import {TreeForm} from "../MarkerForm/TreeForm";
import {NewTreeMarker} from "../NewTreeMarker/NewTreeMarker";
import {MapState} from "./MapState";
import {useHistory} from "react-router-dom";
import {
    getTreeMapInfoUrl,
    getTreeDataUrl,
    getClusterMapInfoUrl,
    fetchData
} from '../ApiDataLoadHelper/DataLoadHelper';
import MapButton from '../MapButton';
import styles from "./GeojsonLayer.module.css";
import ClusterMarker from '../ClusterMarker/ClusterMarker';
import MarkerClusterGroup from "react-leaflet-markercluster/src/react-leaflet-markercluster";
import {IJsonTree} from "../../common/types";
import {
    IGeolocationCoords,
    IGeojsonLayerProps,
    IJsonMapTree,
    IJsonMapTreeCluster,
    ILatLng,
    IMapDataClustered,
    IMapDataSeparateTrees,
    MapContainerCoords
} from "./types";
import {DefaultClusterColor, DefaultTreeColor, TreeSpeciesColors} from "./treeSpeciesColors";
import "./GeojsonLayer.module.css";
import MapButtonGeneral from "../MapAdditionalControls";
import MapButtonContainer from "../MapAdditionalControls/MapButtonContainer";
import MapButtonStyles from "../MapAdditionalControls/MapButtonStyles.module.css";
import mapIcon from "../../common/images/map_marker.png";

const DG = require('2gis-maps');

let lastLambda: any = null;
let lastMarkerLayer: any = null;
const GeojsonLayer = ({map, mapState, setMapState, setMapViewOnUser, pointerMarker, user}: IGeojsonLayerProps) => {
    const [activeTreeId, setActiveTreeId] = useState<string | number | null>(null);
    const [activeTreeData, setActiveTreeData] = useState<IJsonTree | null>(null);
    const [mapData, setMapData] = useState<IMapDataSeparateTrees | IMapDataClustered | null>(null);
    const waitingLoadData = useRef<boolean>(false);
    const componentMounted = useRef<boolean>(false);
    const markerRef = useRef<ILatLng | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // User geolocation

    const userCircleRef = useRef<any>(null);
    const userCircleMarkerRef = useRef<any>(null);
    // const pointerMarkerRef = useRef<any>(null);
    const watchPositionId = useRef<number | null>(null);
    const pointerMarkerRef = useRef<any>(null);
    const pointerMarkerPlaced = useRef<boolean>(false);
    const treeData = useRef<{data: IJsonMapTree[]}>({data: []});
    const history = useHistory();

    const markerLayer = DG.featureGroup();
    const treesLayer = DG.featureGroup();
    const geometryLayer = DG.featureGroup();

    const userGeolocationZoom: number = 30;
    const userCircleColor: string = "#35C1DE";

    const startWatchUserGeolocation = () => {
        watchPositionId.current = navigator.geolocation.watchPosition(updateUserGeolocation, () => {
        }, {enableHighAccuracy: true});
        geometryLayer.addTo(map);
    }

    const updateUserGeolocation = (e: { coords: IGeolocationCoords }) => {
        const latitude = e.coords.latitude;
        const longitude = e.coords.longitude;
        const accuracy = e.coords.accuracy;
        // console.log(`accuracy: ${accuracy}`);

        if (accuracy > 300) return; // FIXME: too low accuracy
        if (userCircleRef.current == null) {
            // FIXME: The circle is quite large when accuracy is big
            // console.log(`> geolocation: ${latitude} ${longitude}`);
            userCircleRef.current = new DG.circle([latitude, longitude], accuracy, {color: userCircleColor})
                // .bindPopup("You are Here").openPopup()
                .addTo(geometryLayer);
            userCircleMarkerRef.current = new DG.circleMarker([latitude, longitude],
                {color: '#ffffff', fillColor: userCircleColor, fill: true, fillOpacity: 1})
                .bindPopup("You are Here").openPopup()
                .addTo(geometryLayer);
            // console.log(`GeojsonLayer: setMapViewOnUser: `);
            // console.log(setMapViewOnUser);
            if (setMapViewOnUser) {
                waitingLoadData.current = false;
                map.setView([latitude, longitude], userGeolocationZoom);
            }
        } else {
            userCircleRef.current.setLatLng([latitude, longitude]);
            userCircleRef.current.setRadius(accuracy);
            userCircleMarkerRef.current.setLatLng([latitude, longitude]);
        }
    }

    useEffect(() => {
        componentMounted.current = true;
        if (pointerMarker && pointerMarker.marker) {
            const position = [pointerMarker.lat, pointerMarker.lng];
            pointerMarkerRef.current = DG.marker(position, {
                draggable: false,
                icon: DG.icon({iconUrl: mapIcon, iconSize: [42, 58], iconAnchor: [21, 59]})
            });
        }
    }, []);

    useEffect(() => () => {
        componentMounted.current = false;
        // console.log(" > onUnmount");
        if (watchPositionId.current !== null) {
            // console.log("disposing watch location id");
            navigator.geolocation.clearWatch(watchPositionId.current);
        }
        // console.log(" > map");
        // console.log(map);

        map && map.off('click', handleClick);
        map && map.off('zoomend', handleZoomEndMoveEnd);
        map && map.off('moveend', handleZoomEndMoveEnd);
    }, []);

    // FIXME: type of 2-gis event
    const updateMarkerRef = (event: any) => {
        markerRef.current = event.latlng;
    }

    const loadData = () => {
        // console.log("> loadData: start loading data...");
        // console.log(`watching geoposition: ${watchPositionId.current}`);
        // Start watching User geolocation if haven't started before
        if (watchPositionId.current === null) {
            // console.log("started watching geolocation");
            startWatchUserGeolocation();
        }
        // console.log(activeTreeData);
        if (waitingLoadData.current || activeTreeData || activeTreeId) {
            return;
        }

        const containerLatLng = getMapContainerLatLng();
        const dataIsClustered = map.getZoom() <= 16;
        waitingLoadData.current = true;
        if (dataIsClustered) {
            // console.log("Fetching Clustered data");
            requestClusteredData(containerLatLng);
        } else {
            requestTreeData(containerLatLng);
        }
    };

    const requestClusteredData = (containerLatLng: MapContainerCoords) => {
        fetchData(getClusterMapInfoUrl(containerLatLng))
            .then((jsonData: IJsonMapTreeCluster[]) => {
                if (!componentMounted.current) {
                    // console.log(" > fetch but component Unmounted");
                    return;
                }
                // console.log(`Fetched ${jsonData.length} clusters`)
                treeData.current.data = [];
                setMapData({isClusterData: true, json: jsonData});
                setUpTreeCircles(mapState, {isClusterData: true, json: jsonData}, handleTreeClick, treesLayer);
                treesLayer.addTo(map);
                // console.log("> loadData: data is loaded!");
                waitingLoadData.current = false;
            })
            .catch(err => {
                waitingLoadData.current = false;
                alert("Возникла ошибка при загрузке деревьев");
                console.error(err);
            });
    };

    const requestTreeData = (containerLatLng: MapContainerCoords) => {
        fetchData(getTreeMapInfoUrl(containerLatLng))
            .then((jsonData: IJsonMapTree[]) => {
                if (!componentMounted.current) {
                    // console.log(" > fetch but component Unmounted");
                    return;
                }
                // console.log(`Fetched ${jsonData.length} trees`)
                setMapData({isClusterData: false, json: jsonData});
                // console.log(map);
                // const pointer = (setMarkerOnView && map) ? [map._lastCenter.lat, map._lastCenter.lng] as [number, number] : undefined;
                treeData.current.data = jsonData;
                setUpTreeCircles(mapState, {isClusterData: false, json: jsonData}, handleTreeClick, treesLayer);
                treesLayer.on("click", handleLayerClick(treeData.current, 9, handleTreeClick));
                treesLayer.addTo(map);
                waitingLoadData.current = false;
            })
            .catch(err => {
                waitingLoadData.current = false;
                alert("Возникла ошибка при загрузке деревьев");
                console.error(err);
            });
    };



    const getMapContainerLatLng = (): MapContainerCoords => {
        const mapContainerCoordinates = map.getContainer().getBoundingClientRect()
        const {bottom, right, x, y} = mapContainerCoordinates;
        const upperLeftCorner = map.containerPointToLatLng([y, x]);
        const bottomRightCorner = map.containerPointToLatLng([right, bottom]);
        return [
            {lat: upperLeftCorner.lat + 0.02, lng: upperLeftCorner.lng - 0.02},
            {lat: bottomRightCorner.lat - 0.02, lng: bottomRightCorner.lng + 0.02}
        ];
    };

    // FIXME: What type of events should 2-gis have
    const handleTreeClick = (e: any, item: IJsonMapTree) => {
        waitingLoadData.current = true;
        item.id && setActiveTreeId(item.id);
        map.setView([e.latlng.lat, e.latlng.lng]);
    }

    // FIXME: What type of events should 2-gis have
    const handleClick = useCallback((event: any) => {
        // console.log(event.latlng);
        // console.log(`handleClick: ${mapState}`);
        if (mapState === MapState.addTreeSelected) {
            return;
        }
        if (event.originalEvent.target.tagName === 'BUTTON') {
            return;
        }
        for (const layer in markerLayer._layers) {
            markerLayer._layers[layer].removeFrom(map);
            delete markerLayer._layers[layer];
        }
        markerLayer.removeFrom(map);

        if (mapState === MapState.addTreeBegin) {
            setMapState(MapState.addTreeSelected)
            updateMarkerRef(event);
            DG.marker(markerRef.current, {draggable: true})
                .addTo(markerLayer)
                .on('drag', updateMarkerRef);
            markerLayer.addTo(map);
        }
        // FIXME: saving last markerLayer to clean after cancel
        lastMarkerLayer = markerLayer;
    }, [map, markerLayer]);

    const clearLayer = (mapLayer: any) => {
        for (const layer in mapLayer._layers) {
            mapLayer._layers[layer].removeFrom(map);
            delete mapLayer._layers[layer];
        }
    };

    const handleClickTreeFormWrapper = () => {
        setActiveTreeId(null);
        waitingLoadData.current = false;
    }

    const handleClose = () => {
        // console.log("handle close");
        setActiveTreeData(null);
        waitingLoadData.current = false;
    }

    const handleZoomEndMoveEnd = useCallback(() => {
        if (waitingLoadData.current) return;
        clearLayer(treesLayer);
        map && loadData();
    }, [map])

    useEffect(() => {
        map && map.off({'click': lastLambda});
        lastLambda = handleClick;
        map && map.on('click', handleClick);
        map && map.on('moveend', handleZoomEndMoveEnd);
    }, [map, mapState]);

    useLayoutEffect(() => {
        map && map.off('click', handleClick);
    }, []);

    useEffect(() => {
        map && !mapData && loadData();

        if (map && !pointerMarkerPlaced.current && pointerMarkerRef.current) {
            pointerMarkerRef.current.addTo(markerLayer);
            markerLayer.addTo(map);
            pointerMarkerPlaced.current = true;
        }
    }, [map, mapData]);

    useEffect(() => {
        if (map === null || map === undefined) return;
        setActiveTreeData(null);
        activeTreeId &&
        fetchData(getTreeDataUrl(activeTreeId))
            .then((jsonData: IJsonTree) => {
                setActiveTreeData(jsonData);
            })
            .catch(err => {
                alert("Возникла ошибка при загрузке информации о дереве");
                console.error(err);
            })
    }, [activeTreeId]);

    useEffect(() => {
        if (mapState === MapState.addTreeSubmit) {
            if (markerRef.current === null) {
                return;
            }
            const {lat, lng} = markerRef.current;
            history.push(`/addtree/${lat}/${lng}`);
        }
    })

    const stylesCN = cn({
        [styles.treeFormContainer]: true
    });

    const HandleAddTreeCancel = (s: number) => {
        clearLayer(lastMarkerLayer);
        lastMarkerLayer.removeFrom(map);
        setMapState(MapState.default);
    }

    const HandleMapStateChange = (state: number) => {
        switch (state) {
            case MapState.default:
                setMapState(MapState.addTreeBegin);
                break;
            case MapState.addTreeSelected:
                setMapState(MapState.addTreeSubmit);
                break;
        }
    }

    const HandleMapStateButtonTitleChange = (state: number): string => {
        switch (state) {
            case MapState.default:
                return "Добавить дерево";
            case MapState.addTreeBegin:
                return "Укажите точку на карте";
            case MapState.addTreeSelected:
            case MapState.addTreeSubmit:
                return "Добавить";
            default:
                return ""
        }
    }

    const renderButtons = () => user &&
        <MapButtonContainer>
            {(mapState != MapState.default) && (
                <MapButtonGeneral state={mapState} changeState={HandleAddTreeCancel}
                                  getTitle={(s: number) => "Отмена"} isDisabled={(s: number) => s == MapState.default}
                                  styleName={MapButtonStyles.mapButtonSecondary}/>
            )}
            <MapButtonGeneral state={mapState} changeState={HandleMapStateChange}
                              getTitle={HandleMapStateButtonTitleChange}
                              isDisabled={(s: number) => s == MapState.addTreeBegin}
                              styleName={MapButtonStyles.mapButtonSuccess}/>
        </MapButtonContainer>

    return (
        <>
            <div className={stylesCN} onClick={handleClickTreeFormWrapper}>
                {activeTreeData && <TreeForm activeTree={activeTreeData} onClose={handleClose}/>}
            </div>
            {!activeTreeData && renderButtons()}
        </>
    );
}


function setUpTreeCircles(state: number, data: IMapDataSeparateTrees | IMapDataClustered, handleTreeClick: any, layer: any) {
    if (data.isClusterData) {
        data.json.forEach(item => {
            const {latitude, longitude} = item.centre;
            const size = 30;
            const clusterMarkerDivStyle = `
				width: ${size}px;
				height: ${size}px;
				margin: 5px;
				border-radius: 20px;
				background-color:rgba(110,204,57,0.6);
				text-align: center;
    			font-size: 12px;
			`;
            const clusterMarkerSpanStyle = `
				line-height: 30px;
			`;
            const markerIcon = divIcon({
                html: `<div style="${clusterMarkerDivStyle}"><span style="${clusterMarkerSpanStyle}">${item.count}</span></div>`,
                className: "circle-div-icon",
                iconSize: [40, 40]
            });
            DG.marker([latitude, longitude], {icon: markerIcon}).addTo(layer);
        });
    } else {
        data.json.forEach(item => {
            const {latitude, longitude} = item.geographicalPoint;
            let color: string = DefaultTreeColor;
            if (item.species) {
                const species = item.species.title;
                if (species in TreeSpeciesColors) {
                    color = TreeSpeciesColors[species];
                }
            }
            let circleRadius = item.diameterOfCrown / 2;
            const minCircleRadius = 2;
            circleRadius = circleRadius < minCircleRadius ? minCircleRadius : circleRadius;

            const treeCircle = DG.circle([latitude, longitude], {
                radius: circleRadius, color: color, fillColor: color,
                fill: true, fillOpacity: 1, weight: 0, opacity: 1.0
            }).addTo(layer);

            const touchCircleRadius = 9;
            if (circleRadius >= touchCircleRadius) {
                treeCircle.on('click', (e: any) => handleTreeClick(e, item));
            } else {
                DG.circle([latitude, longitude], {
                    radius: touchCircleRadius, fillColor: "red",
                    fill: true, weight: 0, fillOpacity: 0, opacity: 0
                }).addTo(layer)
                // .on('click', (e: any) => handleTreeClick(e, item));
            }
        });
    }
}


const handleLayerClick = (trees: { data: IJsonMapTree[] }, threshold: number, handleTreeClick: any) => (event: any) => {
    // console.log(event);
    let nearsetTree: IJsonMapTree | null = null;
    let minDist: number = 1e9;
    trees.data.forEach(item => {
        const treePos = {
            lat: item.geographicalPoint.latitude,
            lng: item.geographicalPoint.longitude
        };
        if (!item.geographicalPoint.latitude || !item.geographicalPoint.longitude) return;
        const currDist = DistanceInMeters(event.latlng.lat, event.latlng.lng, item.geographicalPoint.latitude, item.geographicalPoint.longitude);
        // console.log(`distance: ${currDist}`);
        if (currDist <= threshold && currDist < minDist) {
            minDist = currDist;
            nearsetTree = item;
        }
    });
    if (nearsetTree) {
        handleTreeClick(event, nearsetTree);
    }
}

function DistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    let R = 6371; // km
    let dLat = toRad(lat2 - lat1);
    let dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c * 1000;
    return d;
}

// Converts numeric degrees to radians
function toRad(val: number): number {
    return val * Math.PI / 180;
}


// NOTE: not used, function setUpTreeCircles is used instead
function getMarkerClusterGroup(state: number, data: IMapDataSeparateTrees | IMapDataClustered, setActiveTree: any, map: any) {
    /* FixMe - Этот кусок кода игнорируется, т.к isClusterData зашит на false.
            Как я понял, MarkerClusterGroup должен принимать столько точек, сколько реально должно отрисоваться.
            Т.е. если нам пришло 8 точек, то в MarkerClusterGroup должно быть 8 объектов, тогда кластеризация происходит корректно.
            На данный момент в MarkerClusterGroup приходит 1 объект, в котором число доступных деревьев равно 8.
            На экране отрисовывается точка с числом 8, а после слияния с другой точкой отображается число 2, т.к. отрисовано всего 2 объекта.
    */
    if (data.isClusterData) {
        // console.log("Creating MarkerClusterGroup");
        return (
            <MarkerClusterGroup disableClusteringAtZoom={19}>
                {data.json

                    .map((f: any, idx: number) => (
                        <ClusterMarker
                            key={idx}
                            count={f.count}
                            position={[f.centre.latitude, f.centre.longitude]}
                            weight={1}>
                        </ClusterMarker>
                    ))}
            </MarkerClusterGroup>);
    } else {
        // console.log(map.getZoom(), 'zoom');
        return (
            <MarkerClusterGroup disableClusteringAtZoom={19}>
                {data.json
                    .map((f: IJsonTree, idx: number) => GenerateCircleForTree(f, idx,
                        () => state === MapState.default && setActiveTree(f.id), 1))
                }
            </MarkerClusterGroup>
        );
    }
}


function GenerateCircleForTree(f: IJsonTree, key: number, onClick: any, title: string | number) {
    if (f.geographicalPoint === undefined ||
        f.geographicalPoint.latitude === null ||
        f.geographicalPoint.longitude === null
    ) {
        return null;
    }

    const customProps = {title: title};
    return (
        <Circle
            eventHandlers={{click: onClick}}
            key={key}
            center={[f.geographicalPoint.latitude, f.geographicalPoint.longitude]}
            pathOptions={getCircleOptions(f.species?.title ?? "")}
            radius={getCircleRadius(f.diameterOfCrown ?? 10)}
            weight={1}
            // title={1}
            {...customProps} // used instead of "title={1}"
        >
        </Circle>
    )
}


export default GeojsonLayer;