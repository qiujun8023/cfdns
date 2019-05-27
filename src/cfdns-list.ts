#!/usr/bin/env node

import _ from 'lodash'
import chalk from 'chalk'
import Table from 'cli-table'
import program from 'commander'
import utils from './libs/utils'

let hander = async (domain: string | null = null) => {
  let cloudflre = utils.getCloudflreInstance()
  let records = await cloudflre.getAllDNSRecords()
  let groupedRecords = utils.groupDNSRecords(records)
  let groups = Object.keys(groupedRecords).sort(utils.compareDomains)

  if (domain != null) {
    let suffix = _.trim(domain, '.')
    groups = groups.filter(group => group.endsWith(suffix))
  }

  for (let group of groups) {
    console.log(' Domain: ' + chalk.green(group));
    let table = new Table({
      head: ['Type', 'Name', 'Content', 'TTL', 'Proxiable', 'Proxied'],
      colWidths: [10, 10, 41, 5, 11, 9],
      colAligns: ['middle', 'middle', 'middle', 'middle', 'middle', 'middle'],
      style: {
        head: ['cyan']
      }
    })

    table.push(...groupedRecords[group]
      .sort((a, b) => utils.compareDomains(a.name, b.name))
      .map((record) => {
        return [
          record.type,
          utils.getDomainPrefix(record.name, group),
          record.content,
          record.ttl,
          record.proxiable,
          record.proxied
        ]
      }))

    console.log(table.toString())
  }
}

program
  .arguments('[domain]')
  .action(hander)
  .parse(process.argv)
