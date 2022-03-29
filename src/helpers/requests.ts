import Cookies from 'universal-cookie';
import decode from "jwt-decode";

const cookies = new Cookies();

export default class RequestService {
	static async processHeaders(headers: HeadersInit = {}) {
		await this.refreshToken()
		const token = cookies.get('AccessToken');
		return {
			...headers,
			...token && {'Authorization': `Bearer ${token}`}
		};
	}

	static async validateAndParseResponse(response: Response) {
		if (!([200, 201].includes(response.status))) {
			throw `${response.status} ${response.statusText}`;
		}
		return await response.json();
	}

	static async getData(url: string, headers: HeadersInit = {}) {
		const response = await fetch(url, {
			method: 'GET',
			headers: await this.processHeaders(headers),
		});
		return await this.validateAndParseResponse(response);
	}

	static async postData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}) {
		const response = await fetch(url, {
			method: 'POST',
			headers: await this.processHeaders(headers),
			body
		});
		return await this.validateAndParseResponse(response);
	}

	static async putData(url: string, body: BodyInit | null | undefined, headers: HeadersInit = {}) {
		const response = await fetch(url, {
			method: 'PUT',
			headers: await this.processHeaders(headers),
			body
		});
		await this.validateAndParseResponse(response);
		return true;
	}

	static async deleteData(url: string, headers: HeadersInit = {}): Promise<boolean> {
		let response = await fetch(url, {
			method: 'DELETE',
			headers: await this.processHeaders(headers),
		});
		return await this.validateAndParseResponse(response);
	}

	static refreshToken() {
		const token = cookies.get('AccessToken');
		const decoded_token: any = token ? decode(token) : null;
		if(decoded_token && decoded_token.exp - Math.round(Date.now() / 1000) < 10) {
			return fetch("/auth/newTokens", {
				method: 'POST',
				headers: { 'Authorization': `Bearer ${token}` },
			})
		}
		return Promise.resolve();
	}

	static refreshTokenForce() {
		const token = cookies.get('AccessToken');
		return fetch("/auth/newTokens", {
			method: 'POST',
			headers: { 'Authorization': `Bearer ${token}` },
		})
	}
}