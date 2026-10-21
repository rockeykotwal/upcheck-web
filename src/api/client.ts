import axios from 'axios';
import { env } from '../config/env';

const client = axios.create({
  baseURL: env.apiUrl,
});

export default client;
