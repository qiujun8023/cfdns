import _ from 'lodash';
import ms from 'ms';
import { ICloudflreDNSRecord, IGroupCloudflreDNSRecord } from '../types';
import Cloudflre from './cloudflre';
import Config from './config';

const CONFIG_PATH = process.env.HOME + '/.cfdns.dat';

class Utils {
  private config: Config | null = null;
  private cloudflare: Cloudflre | null = null;

  public getConfigInstance() {
    if (!this.config) {
      this.config = new Config(CONFIG_PATH);
    }
    return this.config;
  }

  public getCloudflreInstance() {
    if (!this.cloudflare) {
      const config = this.getConfigInstance();
      if (!config.exists()) {
        console.error('Please login first.');
        process.exit(1);
      }

      const { email, key } = config.load();
      this.cloudflare = new Cloudflre(email, key);
    }
    return this.cloudflare;
  }

  public groupDNSRecords(records: ICloudflreDNSRecord[]) {
    const result: IGroupCloudflreDNSRecord = {};

    for (const record of records) {
      let group = record.zoneName;
      if (record.name !== record.zoneName) {
        const index = record.name.indexOf('.');
        group = record.name.substring(index + 1);
      }

      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(record);
    }

    for (const group of Object.keys(result)) {
      result[group] = result[group].filter((record) => {
        if (group !== record.name && result[record.name]) {
          result[record.name].push(record);
          return false;
        }
        return true;
      });
    }

    return result;
  }

  public filterDNSRecords(records: ICloudflreDNSRecord[], name: string, type: string, content: string) {
    return records.filter((record) => {
      if (name && record.name !== name) {
        return false;
      }

      if (type && record.type.toLowerCase() !== type.toLowerCase()) {
        return false;
      }

      if (content && record.content !== content) {
        return false;
      }

      return true;
    });
  }

  public compareDomains(a: string, b: string) {
    const reverseDomain = (domain: string) => {
      return (domain || '').split('.').reverse().join('.');
    };

    return reverseDomain(a) > reverseDomain(b) ? 1 : -1;
  }

  public getDomainPrefix(domain: string, group: string) {
    const index = domain.lastIndexOf(group);
    if (index === 0) {
      return '@';
    }
    return domain.substring(0, index - 1);
  }

  public parseTTL(ttl: string) {
    if (!ttl) {
      return ttl;
    } else if (!isNaN(Number(ttl))) {
      return parseInt(ttl, 10);
    }

    return ms(ttl) / 1000;
  }
}

export default new Utils();
