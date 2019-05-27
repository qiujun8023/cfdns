import _ from 'lodash'
import Config from './config'
import Cloudflre from './cloudflre'
import { CloudflreDNSRecord, GroupCloudflreDNSRecord } from '../types'

const CONFIG_PATH = process.env['HOME'] + '/.cfdns.dat'

class Utils {
  private config: Config | null = null
  private cloudflare: Cloudflre | null = null

  getConfigInstance () {
    if (!this.config) {
      this.config = new Config(CONFIG_PATH)
    }
    return this.config
  }

  getCloudflreInstance () {
    if (!this.cloudflare) {
      let config = this.getConfigInstance()
      if (!config.exists()) {
        console.error('Please login first.')
        process.exit(1)
      }

      let { email, key } = config.load()
      this.cloudflare = new Cloudflre(email, key)
    }
    return this.cloudflare
  }

  groupDNSRecords (records: CloudflreDNSRecord[]): GroupCloudflreDNSRecord {
    let result: GroupCloudflreDNSRecord = {}

    for (let record of records) {
      let group = record.zoneName
      if (record.name !== record.zoneName) {
        let index = record.name.indexOf('.')
        group = record.name.substring(index + 1)
      }

      if (!result[group]) {
        result[group] = []
      }
      result[group].push(record)
    }

    for (let group in result) {
      result[group] = result[group].filter((record) => {
        if (group !== record.name && result[record.name]) {
          result[record.name].push(record)
          return false
        }
        return true
      })
    }

    return result
  }

  filterDNSRecords (records: CloudflreDNSRecord[], name: string, type: string, content: string): CloudflreDNSRecord[] {
    return records.filter((record) => {
      if (name && record.name !== name) {
        return false
      }

      if (type && record.type.toLowerCase() !== type.toLowerCase()) {
        return false
      }

      if (content && record.content !== content) {
        return false
      }

      return true
    })
  }

  compareDomains (a: string, b: string) {
    let reverseDomain = (domain: string) => {
      return (domain || '').split('.').reverse().join('.')
    }

    return reverseDomain(a) > reverseDomain(b) ? 1 : -1
  }

  getDomainPrefix (domain: string, group: string) {
    let index = domain.lastIndexOf(group)
    if (index === 0) {
      return '@'
    }
    return domain.substring(0, index - 1)
  }
}

export default new Utils()
