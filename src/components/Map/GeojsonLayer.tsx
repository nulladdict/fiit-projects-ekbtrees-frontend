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
import { IJsonTree } from "../../common/types";
import {
	IGeojsonLayerProps,
	IJsonMapTree,
	IJsonMapTreeCluster,
	ILatLng,
	IMapDataClustered,
	IMapDataSeparateTrees
} from "./types";
import {DefaultClusterColor, DefaultTreeColor, TreeSpeciesColors} from "./treeSpeciesColors";
import "./GeojsonLayer.module.css";
import MapButtonGeneral from "../MapAdditionalControls";
import MapButtonContainer from "../MapAdditionalControls/MapButtonContainer";
import MapButtonStyles from "../MapAdditionalControls/MapButtonStyles.module.css";
import MapButtonAddTree from "../MapAdditionalControls/MapButtonAddTree";
const DG = require('2gis-maps');

let lastLambda: any = null;
let lastMarkerLayer: any = null;
const GeojsonLayer = ({map, mapState, setMapState, user} : IGeojsonLayerProps) => {
	const [activeTreeId, setActiveTreeId] = useState<string | number | null>(null);
	const [activeTreeData, setActiveTreeData] = useState<IJsonTree | null>(null);
	const [newTreePosition, setNewTreePosition] = useState(null);
	const [mapData, setMapData] = useState<IMapDataSeparateTrees | IMapDataClustered | null>(null);
	const waitingLoadData = useRef<boolean>(false);
	const componentMounted = useRef<boolean>(false);
	const markerRef = useRef<ILatLng | null>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);


	// User geolocation

	const userCircleRef = useRef<any>(null);
	const userCircleMarkerRef = useRef<any>(null);
	const watchPositionId = useRef<number | null>(null);
	const handlersSetUp = useRef<boolean>(false);
	const history = useHistory();

	const disableClusteringAtZoom = 19;
	const markerLayer = DG.featureGroup();
	const treesLayer = DG.featureGroup();
	const geometryLayer = DG.featureGroup();

	const userGeolocationZoom: number = 30;
	const userCircleColor: string = "#35C1DE";

	// const markerLayerRef = useRef<any | null>(null);
	// if (markerLayerRef.current === null) {
	// 	console.log("set up new marker layer");
	// 	markerLayerRef.current = markerLayer;
	// 	console.log(markerLayerRef.current);
	// }
	// let setClickHandler = false;

	const startWatchUserGeolocation = () => {
		watchPositionId.current = navigator.geolocation.watchPosition((e) => {
			const latitude = e.coords.latitude;
			const longitude = e.coords.longitude;
			const accuracy = e.coords.accuracy;
			if (userCircleRef.current == null) {
				// FIXME: The circle is quite large when accuracy is big
				// console.log(`> geolocation: ${latitude} ${longitude}`);
				userCircleRef.current = new DG.circle([latitude, longitude], accuracy, { color: userCircleColor })
					// .bindPopup("You are Here").openPopup()
					.addTo(geometryLayer);
				userCircleMarkerRef.current = new DG.circleMarker([latitude, longitude],
					{ color: '#ffffff', fillColor: userCircleColor, fill: true, fillOpacity: 1 })
					.bindPopup("You are Here").openPopup()
					.addTo(geometryLayer);
				map.setView([latitude, longitude], userGeolocationZoom);
			} else {
				userCircleRef.current.setLatLng([latitude, longitude]);
				userCircleRef.current.setRadius(accuracy);
				userCircleMarkerRef.current.setLatLng([latitude, longitude]);
			}
		}, () => {}, { enableHighAccuracy: true });
		geometryLayer.addTo(map);
	}

	useEffect(() => {
		componentMounted.current = true;
	}, []);

	useEffect( () => () => {
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
	}, [] );

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
		if (waitingLoadData.current || activeTreeData) {
			return;
		}

		const containerLatLng = getMapContainerLatLng();
		const dataIsClustered = map.getZoom() < 14;
		waitingLoadData.current = true;
		if (dataIsClustered) {
			// console.log("Fetching Clustered data");

			fetchData(getClusterMapInfoUrl(containerLatLng))
				.then((jsonData: IJsonMapTreeCluster[]) => {
					if (!componentMounted.current) {
						// console.log(" > fetch but component Unmounted");
						return;
					}
					// console.log(`Fetched ${jsonData.length} clusters`)
					setMapData({isClusterData: dataIsClustered, json: jsonData});
					setUpTreeCircles(mapState, {isClusterData: dataIsClustered, json: jsonData}, handleTreeClick, treesLayer);
					treesLayer.addTo(map);
					// console.log("> loadData: data is loaded!");
					waitingLoadData.current = false;
				})
				.catch(err => {
					waitingLoadData.current = false;
					alert("Возникла ошибка при загрузке деревьев");
					console.error(err);
				});
		} else {
			// console.log("Fetching not Clustered data");
			// FIXME: What type of events should 2-gis have
			fetchData(getTreeMapInfoUrl(containerLatLng))
				.then((jsonData: IJsonMapTree[]) => {
					if (!componentMounted.current) {
						// console.log(" > fetch but component Unmounted");
						return;
					}
					// console.log(`Fetched ${jsonData.length} trees`)
					setMapData({isClusterData: dataIsClustered, json: jsonData});
					setUpTreeCircles(mapState, {isClusterData: dataIsClustered, json: jsonData}, handleTreeClick, treesLayer);
					treesLayer.addTo(map);
					// console.log("> loadData: data is loaded!");
					waitingLoadData.current = false;
				})
				.catch(err => {
					waitingLoadData.current = false;
					alert("Возникла ошибка при загрузке деревьев");
					console.error(err);
				});
		}
	};

	const getMapContainerLatLng = () => {
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
		map.setView([e.latlng.lat, e.latlng.lng]);
		item.id && setActiveTreeId(item.id);
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
	}

	const handleClose = () => {
		setActiveTreeData(null)
	}

	const handleZoomEndMoveEnd = useCallback(() => {
		clearLayer(treesLayer);
		map && loadData();
	}, [map])

	useEffect(() => {
		map && map.off({'click' : lastLambda});
		lastLambda = handleClick;
		map && map.on('click', handleClick);
		map && map.on('moveend', handleZoomEndMoveEnd);
	}, [map, mapState]);

	useLayoutEffect(() => {
		map && map.off('click', handleClick);
	}, []);

	// useEffect(() => {
	// 	// console.log("> useEffect [mapState]: 'click', 'zoomend', 'moveend' -> handleClick");
	// 	// console.log(map.listens('click'));
	// 	map && map.on('click', handleClick);
	// 	// map && map.on('zoomend', handleZoomEndMoveEnd);
	// 	// map && map.on('moveend', handleZoomEndMoveEnd);
	// }, [map]);

	useEffect(() => {
		map && !mapData && loadData();
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

	const HandleMapStateChange = (s: number) => {
		if (s === MapState.default) setMapState(MapState.addTreeBegin);
		if (s === MapState.addTreeSelected) setMapState(MapState.addTreeSubmit);
	}

	const HandleMapStateButtonTitleChange = (s: number): string => {
		if (mapState === MapState.default) return "Добавить дерево";
		if (mapState === MapState.addTreeBegin) return "Укажите точку на карте";
		if (mapState === MapState.addTreeSelected || mapState === MapState.addTreeSubmit)
			return "Добавить";
		return "";
	}

	const renderButtons = () => user &&
		<MapButtonContainer>
			{(mapState != MapState.default) && <MapButtonGeneral state={mapState} changeState={HandleAddTreeCancel}
																 getTitle={(s: number) => "Отмена"} isDisabled={(s: number) => s == MapState.default}
																 styleName={MapButtonStyles.mapButtonSecondary}/>}
			<MapButtonGeneral state={mapState} changeState={HandleMapStateChange}
							  getTitle={HandleMapStateButtonTitleChange} isDisabled={(s: number) => s == MapState.addTreeBegin}
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
			const clusterMarkerDivStyle = `
				width: 30px;
				height: 30px;
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
			const species = item.species.title;
			if (species in TreeSpeciesColors) {
				color = TreeSpeciesColors[species];
			}
			let circleRadius = item.diameterOfCrown / 2;
			circleRadius = circleRadius < 3 ? 3 : circleRadius;
			// console.log(`tree radius is ${circleRadius}`);
			DG.circle([latitude, longitude], circleRadius, {
				color: color, fillColor: color, fill: true, fillOpacity: 1, weight: 1
			}).addTo(layer)
				.on('click', (e: any) => handleTreeClick(e, item));
		});
	}
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
