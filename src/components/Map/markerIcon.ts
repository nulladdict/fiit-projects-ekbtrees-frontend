import markerIcon1x from '../../img/marker-icon.png';
import markerIcon2x from '../../img/marker-icon-2x.png';
const DG = require('2gis-maps');

const markerIcon = DG.icon({
	iconUrl: markerIcon1x,
	iconRetinaUrl: markerIcon2x,
	iconSize: [25, 41],
});

export default markerIcon;
