#!/usr/bin/env node

import program from 'commander'
import utils from './libs/utils'

let hander = async (name: string, type: string, content: string, ctx: program.Command) => {
  let cloudflre = utils.getCloudflreInstance()
  let allRecords = await cloudflre.getAllDNSRecords(name)

  let records = utils.filterDNSRecords(allRecords, name, type, content)
  if (records.length === 0) {
    console.error('DNS record not found.')
    process.exit(1)
  }

  if (!ctx.force && records.length >= 2) {
    console.error('There are two or more DNS records. Use -f or --force to delete.')
    process.exit(1)
  }

  for (let record of records) {
    await cloudflre.delDNSRecord(record.zoneId, record.id)
  }
}

program
  .arguments('<name> [type] [content]')
  .option('-f, --force', 'force to delete multiple records')
  .action(hander)
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
