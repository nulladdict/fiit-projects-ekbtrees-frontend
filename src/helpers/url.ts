export const getUrlParamByKey = (key: string): string => {
	const result = window.location.pathname.split('/').find(param => {
		return param.indexOf(`${key}=`) === 0;
	});

	return result || '';
}

export const getUrlParamValueByKey = (key: string): string => {
	const param = getUrlParamByKey(key).split('=');
	return param[1] || '';
}
