export interface ConfigData {
  email: string
  key: string
}

export interface CloudflreZone {
  id: string
  name: string
  status: string
  paused: boolean
}

export interface CloudflreDNSRecord {
  id: string
  type: string
  name: string
  content: string
  ttl: number
  proxiable: boolean
  proxied: boolean
  zoneId: string
  zoneName: string
}

export interface GroupCloudflreDNSRecord {
  [group: string]: CloudflreDNSRecord[]
}
