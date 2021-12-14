import RequestService from "../../helpers/requests";
import {baseUrl} from "../ApiDataLoadHelper/DataLoadHelper";

export const addTree = (body: {geographicalPoint: {latitude: number | null, longitude: number | null}}) => {
	return RequestService.postData(`${baseUrl}tree`, JSON.stringify(body), {
		'Content-Type': 'application/json'
	})
}

export const uploadFiles = (files: (string | Blob)[]) => {
	return Promise.all(files.map(file => {
		const formData = new FormData();
		formData.append("file", file);

		return RequestService.postData(`${baseUrl}file/upload`, formData);
	}))
};

export const deleteFile = (fileId: number | string) => {
	return RequestService.deleteData(`${baseUrl}file/${fileId}`);
}