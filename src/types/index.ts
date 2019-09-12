export interface IConfigData {
  email: string;
  key: string;
}

export interface ICloudflreZone {
  id: string;
  name: string;
  status: string;
  paused: boolean;
}

export interface ICloudflreDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxiable: boolean;
  proxied: boolean;
  zoneId: string;
  zoneName: string;
}

export interface IGroupCloudflreDNSRecord {
  [group: string]: ICloudflreDNSRecord[];
}
