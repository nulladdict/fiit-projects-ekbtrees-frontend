import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class RequestService {
	static getData (url: string, headers: HeadersInit = {}) {
		const token = cookies.get('AccessToken');

		return fetch(url, {
			method: 'GET',
			headers: {
				...headers,
				'Authorization': `Bearer ${token}`
			},
		})
			.then(response => {
				if (response.status !== 200) {
					throw `${response.status} ${response.statusText}`;
				}

				return response.json();
			});
	}

	// TODO: find а more specific type for body
	static postData (url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}): Promise<any> {
		const token = cookies.get('AccessToken');

		return fetch(url, {
			method: 'POST',
			headers: {
				...headers,
				'Authorization': `Bearer ${token}`
			},
			body
		})
			.then(response => {
				const passingStatuses = [200, 201];

				if (!passingStatuses.includes(response.status)) {
					throw `${response.status} ${response.statusText}`;
				}

				return response.json()
		})
	}

	static deleteData(url: string, headers: HeadersInit = {}): Promise<boolean> {
		const token = cookies.get('AccessToken');

		return fetch(url, {
			method: 'DELETE',
			headers: {
				...headers,
				'Authorization': `Bearer ${token}`
			},
		})
		.then(response => {
			if (response.status !== 200) {
				throw `${response.status} ${response.statusText}`;
				return false;
			}

			return true;
		});
	}
}
