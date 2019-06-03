#!/usr/bin/env node

import program from 'commander'
import utils from './libs/utils'

let hander = async (name: string, type: string, content: string, ctx: program.Command) => {
  let cloudflre = utils.getCloudflreInstance()

  let zoneId = ''
  let zones = await cloudflre.getZones()
  for (let zone of zones) {
    if (name.endsWith(zone.name)) {
      zoneId = zone.id
      break
    }
  }

  if (!zoneId) {
    console.error('No related zone found in cloudflare')
    process.exit(1)
  }

  await cloudflre.addDNSRecord(zoneId, {
    type: type.toUpperCase(),
    name: name,
    content: content,
    ttl: ctx.ttl,
    proxied: Boolean(ctx.proxy)
  })
}

program
  .arguments('<name> <type> <content>')
  .option('--ttl [ttl]', 'special TTL value', utils.parseTTL, 1)
  .option('--proxy', `enable Cloudflare's proxy`)
  .action(hander)
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
