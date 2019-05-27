#!/usr/bin/env node

import program from 'commander'
import utils from './libs/utils'

let hander = async (name: string, type: string, newContent: string, ctx: program.Command) => {
  let cloudflre = utils.getCloudflreInstance()

  let allRecords = await cloudflre.getAllDNSRecords(name)
  let records = utils.filterDNSRecords(allRecords, name, type, ctx.oldContent)
  if (records.length === 0) {
    console.error('DNS record not found.')
    process.exit(1)
  } else if (records.length >= 2) {
    console.error('There are two or more DNS records. use --old-content to specify a specific record')
    process.exit(1)
  }

  let record = records[0]
  await cloudflre.editDNSRecord(record.zoneId, record.id, {
    type: record.type,
    name: record.name,
    content: newContent,
    ttl: ctx.ttl === undefined ? ctx.ttl : record.ttl,
    proxied: ctx.proxy === undefined ? ctx.proxy : record.proxied
  })
}

program
  .arguments('<name> <type> <new-content>')
  .option('--ttl [ttl]', 'special TTL value')
  .option('--proxy', `enable Cloudflare's proxy`)
  .option('--old-content [old-content]', 'old DNS record content')
  .action(hander)
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
