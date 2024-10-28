export interface Environment {
  production: boolean
  rootUrl: string
  withCredentials: boolean
  token_endpoint?: string
  client_id?: string
  client_secret?: string
  cachable_urls: string[]
  max_cache_minutes: number
  crypto_key?: string
}
