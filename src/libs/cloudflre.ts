import _ from 'lodash';
import { ICloudflreDNSRecord, ICloudflreZone } from '../types';
const CloudflreLib = require('cloudflare');

export default class Cloudflre {
  private cloudflare: any;

  constructor(email: string, key: string) {
    this.cloudflare = new CloudflreLib({ email, key });
  }

  public async getZones(): Promise<ICloudflreZone[]> {
    const result: ICloudflreZone[] = [];

    for (let page = 1; ; page++) {
      const response = await this.cloudflare.zones.browse({
        page,
        per_page: 1000,
      });

      result.push(...response.result.map(this.transformZone));

      if (response.result_info.page >= response.result_info.total_pages) {
        break;
      }
    }

    return result;
  }

  public async addDNSRecord(zoneId: string, record: any) {
    const result = await this.cloudflare.dnsRecords.add(zoneId, record);
    return this.transformDNSRecord(result);
  }

  public async getDNSRecords(zoneId: string): Promise<ICloudflreDNSRecord[]> {
    const result: ICloudflreDNSRecord[] = [];

    for (let page = 1; ; page++) {
      const response = await this.cloudflare.dnsRecords.browse(zoneId, {
        page,
        per_page: 1000,
      });

      result.push(...response.result.map(this.transformDNSRecord));

      if (response.result_info.page >= response.result_info.total_pages) {
        break;
      }
    }

    return result;
  }

  public async getAllDNSRecords(filterName: string | null = null): Promise<ICloudflreDNSRecord[]> {
    const result: ICloudflreDNSRecord[] = [];
    const zones = await this.getZones();
    for (const zone of zones) {
      if (filterName && !filterName.endsWith(zone.name)) {
        continue;
      }

      const records = await this.getDNSRecords(zone.id);
      result.push(...records);
    }

    return result;
  }

  public async editDNSRecord(zoneId: string, id: string, record: any): Promise<ICloudflreDNSRecord> {
    const result = await this.cloudflare.dnsRecords.edit(zoneId, id, record);
    return this.transformDNSRecord(result);
  }

  public async delDNSRecord(zoneId: string, id: string): Promise<void> {
    await this.cloudflare.dnsRecords.del(zoneId, id);
  }

  private transformZone(cfRawData: any): ICloudflreZone {
    return {
      id: cfRawData.id,
      name: cfRawData.name,
      status: cfRawData.status,
      paused: cfRawData.paused,
    };
  }

  private transformDNSRecord(cfRawData: any): ICloudflreDNSRecord {
    return {
      id: cfRawData.id,
      type: cfRawData.type,
      name: cfRawData.name,
      content: cfRawData.content,
      ttl: cfRawData.ttl,
      proxiable: cfRawData.proxiable,
      proxied: cfRawData.proxied,
      zoneId: cfRawData.zone_id,
      zoneName: cfRawData.zone_name,
    };
  }
}
