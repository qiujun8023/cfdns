import _ from 'lodash'
import { CloudflreZone, CloudflreDNSRecord } from '../types'
const CloudflreLib = require('cloudflare')

export default class Cloudflre {
  private cloudflare: any

  constructor (email: string, key: string) {
    this.cloudflare = new CloudflreLib({ email, key })
  }

  async getZones (): Promise<CloudflreZone[]> {
    let result: CloudflreZone[] = []

    for (let page = 1; ; page++) {
      let response = await this.cloudflare.zones.browse({
        page,
        per_page: 1000
      })

      result.push(...response.result.map(this.transformZone))

      if (response.result_info.page >= response.result_info.total_pages) {
        break
      }
    }

    return result
  }

  async addDNSRecord (zoneId: string, record: any) {
    let result = await this.cloudflare.dnsRecords.add(zoneId, record)
    return this.transformDNSRecord(result)
  }

  async getDNSRecords (zoneId: string): Promise<CloudflreDNSRecord[]> {
    let result: CloudflreDNSRecord[] = []

    for (let page = 1; ; page++) {
      let response = await this.cloudflare.dnsRecords.browse(zoneId, {
        page,
        per_page: 1000
      })

      result.push(...response.result.map(this.transformDNSRecord))

      if (response.result_info.page >= response.result_info.total_pages) {
        break
      }
    }

    return result
  }

  async getAllDNSRecords (filterName: string | null = null): Promise<CloudflreDNSRecord[]> {
    let result: CloudflreDNSRecord[] = []
    let zones = await this.getZones()
    for (let zone of zones) {
      if (filterName && !filterName.endsWith(zone.name)) {
        continue
      }

      let records = await this.getDNSRecords(zone.id)
      result.push(...records)
    }

    return result
  }

  async editDNSRecord (zoneId: string, id: string, record: any): Promise<CloudflreDNSRecord> {
    let result = await this.cloudflare.dnsRecords.edit(zoneId, id, record)
    return this.transformDNSRecord(result)
  }

  async delDNSRecord (zoneId: string, id: string): Promise<void> {
    await this.cloudflare.dnsRecords.del(zoneId, id)
  }

  private transformZone (cfRawData: any): CloudflreZone {
    return {
      id: cfRawData.id,
      name: cfRawData.name,
      status: cfRawData.status,
      paused: cfRawData.paused
    }
  }

  private transformDNSRecord (cfRawData: any): CloudflreDNSRecord {
    return {
      id: cfRawData.id,
      type: cfRawData.type,
      name: cfRawData.name,
      content: cfRawData.content,
      ttl: cfRawData.ttl,
      proxiable: cfRawData.proxiable,
      proxied: cfRawData.proxied,
      zoneId: cfRawData.zone_id,
      zoneName: cfRawData.zone_name
    }
  }
}
