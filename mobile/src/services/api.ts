import axios from 'axios';

export const api = axios.create({
	baseURL: 'https://nlwcopa.loca.lt/',
});
