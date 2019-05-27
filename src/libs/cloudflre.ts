import _ from 'lodash'
import { CloudflreZone, CloudflreDNSRecord } from '../types'
const CloudflreLib = require('cloudflare')

export default class Cloudflre {
  private cloudflare: any

  constructor(email: string, key: string) {
    this.cloudflare = new CloudflreLib({ email, key })
  }

  async getZones(): Promise<CloudflreZone[]> {
    let result: CloudflreZone[] = []

    for (let page = 1; ; page++) {
      let response = await this.cloudflare.zones.browse({
        page,
        per_page: 1000
      })

      for (let item of response.result) {
        result.push({
          id: item.id,
          name: item.name,
          status: item.status,
          paused: item.paused
        })
      }

      if (response.result_info.page >= response.result_info.total_pages) {
        break
      }
    }

    return result
  }

  async getDNSRecords(zoneId: string): Promise<CloudflreDNSRecord[]> {
    let result: CloudflreDNSRecord[] = []

    for (let page = 1; ; page++) {
      let response = await this.cloudflare.dnsRecords.browse(zoneId, {
        page,
        per_page: 1000
      })

      for (let item of response.result) {
        result.push({
          id: item.id,
          type: item.type,
          name: item.name,
          content: item.content,
          ttl: item.ttl,
          proxiable: item.proxiable,
          proxied: item.proxied,
          zoneId: item.zone_id,
          zoneName: item.zone_name
        })
      }

      if (response.result_info.page >= response.result_info.total_pages) {
        break
      }
    }

    return result
  }

  async getAllDNSRecords(): Promise<CloudflreDNSRecord[]> {
    let result: CloudflreDNSRecord[] = []
    let zones = await this.getZones()
    for (let zone of zones) {
      let records = await this.getDNSRecords(zone.id)
      result.push(...records)
    }

    return result
  }
}
