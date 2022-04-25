import RequestService from "../helpers/requests";
import {IJsonTree, IJsonTreeWithImage} from "../common/types";

export const getMyTrees: () => Promise<IJsonTreeWithImage[]> = async () => {
	let data = await RequestService.getData('https://ekb-trees-help.ru/api/tree/get', {
		'Content-Type': 'application/json'
	});
	return data;
}