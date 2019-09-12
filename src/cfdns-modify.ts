#!/usr/bin/env node

import program from 'commander';
import utils from './libs/utils';

const hander = async (name: string, type: string, newContent: string, ctx: program.Command) => {
  const cloudflre = utils.getCloudflreInstance();

  const allRecords = await cloudflre.getAllDNSRecords(name);
  const records = utils.filterDNSRecords(allRecords, name, type, ctx.oldContent);
  if (records.length === 0) {
    console.error('DNS record not found.');
    process.exit(1);
  } else if (records.length >= 2) {
    console.error('There are two or more DNS records. use --old-content to specify a specific record');
    process.exit(1);
  }

  const record = records[0];
  await cloudflre.editDNSRecord(record.zoneId, record.id, {
    type: record.type,
    name: record.name,
    content: newContent,
    ttl: ctx.ttl === undefined ? record.ttl : ctx.ttl,
    proxied: ctx.proxy === undefined ? record.proxied : ctx.proxy,
  });
};

program
  .arguments('<name> <type> <new-content>')
  .option('--ttl [ttl]', 'special TTL value', utils.parseTTL)
  .option('--proxy', `enable Cloudflare's proxy`)
  .option('--old-content [old-content]', 'old DNS record content')
  .action(hander)
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}
