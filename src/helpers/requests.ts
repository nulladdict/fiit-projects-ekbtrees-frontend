import Cookies from 'universal-cookie';
import decode from "jwt-decode";

const cookies = new Cookies();

export default class RequestService {
	static getData(url: string, headers: HeadersInit = {}) {
		return this.refreshToken().then(() => {
			const token = cookies.get('AccessToken');
			if (token) {
				headers = {
					...headers,
					'Authorization': `Bearer ${token}`
				}
			}
			return fetch(url, {
				method: 'GET',
				headers: headers,
			})
				.then(response => {
					if (response.status !== 200) {
						throw `${response.status} ${response.statusText}`;
					}

					return response.json();
				});
		})
	}

	// TODO: find а more specific type for body
	static postData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}): Promise<any> {
		return this.refreshToken().then(() => {
			const token = cookies.get('AccessToken');
			if (token) {
				headers = {
					...headers,
					'Authorization': `Bearer ${token}`
				}
			}
			return fetch(url, {
				method: 'POST',
				headers: headers,
				body
			})
				.then(response => {
					const passingStatuses = [200, 201];

					if (!passingStatuses.includes(response.status)) {
						throw `${response.status} ${response.statusText}`;
					}

					return response.json();
				});
		});
	}

	static putData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}): Promise<any> {
		return this.refreshToken().then(() => {
			const token = cookies.get('AccessToken');
			if (token) {
				headers = {
					...headers,
					'Authorization': `Bearer ${token}`
				}
			}
			return fetch(url, {
				method: 'PUT',
				headers: headers,
				body
			})
				.then(response => {
					const passingStatuses = [200, 201];

					if (!passingStatuses.includes(response.status)) {
						throw `${response.status} ${response.statusText}`;
					}

					return true;
				});
		});
	}

	static deleteData(url: string, headers: HeadersInit = {}): Promise<boolean> {
		return this.refreshToken().then(() => {
			const token = cookies.get('AccessToken');
			if (token) {
				headers = {
					...headers,
					'Authorization': `Bearer ${token}`
				}
			}
			return fetch(url, {
				method: 'DELETE',
				headers: headers,
			})
				.then(response => {
					if (response.status !== 200) {
						throw `${response.status} ${response.statusText}`;
						return false;
					}

					return true;
				});
		});
	}

	static refreshToken (): Promise<any> {
		const token = cookies.get('AccessToken');
		const decoded_token: any = token ? decode(token) : null;
		if(decoded_token && decoded_token.exp - Math.round(Date.now() / 1000) < 10) {
			return fetch("/auth/newTokens", {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
			})
		}
		else {
			return Promise.resolve();
		}
	}

	static refreshTokenForce (): Promise<any> {
		const token = cookies.get('AccessToken');
		return fetch("/auth/newTokens", {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
		})
	}
}