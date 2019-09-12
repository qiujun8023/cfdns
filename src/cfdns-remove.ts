#!/usr/bin/env node

import program from 'commander';
import utils from './libs/utils';

const hander = async (name: string, type: string, content: string, ctx: program.Command) => {
  const cloudflre = utils.getCloudflreInstance();
  const allRecords = await cloudflre.getAllDNSRecords(name);

  const records = utils.filterDNSRecords(allRecords, name, type, content);
  if (records.length === 0) {
    console.error('DNS record not found.');
    process.exit(1);
  }

  if (!ctx.force && records.length >= 2) {
    console.error('There are two or more DNS records. Use -f or --force to delete.');
    process.exit(1);
  }

  for (const record of records) {
    await cloudflre.delDNSRecord(record.zoneId, record.id);
  }
};

program
  .arguments('<name> [type] [content]')
  .option('-f, --force', 'force to delete multiple records')
  .action(hander)
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}
