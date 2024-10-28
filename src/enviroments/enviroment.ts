import { Environment } from '@shared'

export const environment: Environment = {
  production: false,
  rootUrl: 'http://localhost:6540',
  withCredentials: true,
  token_endpoint: '',
  cachable_urls: [],
  max_cache_minutes: 1,
}
