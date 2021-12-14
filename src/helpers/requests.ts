import Cookies from 'universal-cookie';
import decode from "jwt-decode";

const cookies = new Cookies();

export default class RequestService {
	static async getData(url: string, headers: HeadersInit = {}) {
		await this.refreshToken()
		const token = cookies.get('AccessToken');
		if (token) {
			headers = {
				...headers,
				'Authorization': `Bearer ${token}`
			}
		}
		const response = await fetch(url, {
			method: 'GET',
			headers: headers,
		})
		if (response.status === 401) {
			// hmmm
			window.location.pathname = '/login'
		}
		if (response.status !== 200) {
			throw new Error(`${response.status} ${response.statusText}`)
		}

		return response.json();
	}

	// TODO: find а more specific type for body
	static async postData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}): Promise<any> {
		await this.refreshToken()
		const token = cookies.get('AccessToken');
		if (token) {
			headers = {
				...headers,
				'Authorization': `Bearer ${token}`
			}
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body
		})

		const passingStatuses = [200, 201];
		if (!passingStatuses.includes(response.status)) {
			throw new Error(`${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	static async putData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}): Promise<any> {
		await this.refreshToken()
		const token = cookies.get('AccessToken');
		if (token) {
			headers = {
				...headers,
				'Authorization': `Bearer ${token}`
			}
		}
		const response = await fetch(url, {
			method: 'PUT',
			headers: headers,
			body
		})
		const passingStatuses = [200, 201];
		if (response.status === 401) {
			// hmmm
			window.location.pathname = '/login'
		}
		if (!passingStatuses.includes(response.status)) {
			throw new Error(`${response.status} ${response.statusText}`);
		}

		return true;
	}

	static async deleteData(url: string, headers: HeadersInit = {}): Promise<boolean> {
		await this.refreshToken()
		const token = cookies.get('AccessToken');
		if (token) {
			headers = {
				...headers,
				'Authorization': `Bearer ${token}`
			}
		}
		const response = await fetch(url, {
			method: 'DELETE',
			headers: headers,
		})
		if (response.status === 401) {
			// hmmm
			window.location.pathname = '/login'
		}
		if (response.status !== 200) {
			throw new Error(`${response.status} ${response.statusText}`);
		}
		return true;
	}

	// seems strange but okay
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
}