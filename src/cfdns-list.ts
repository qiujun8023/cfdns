#!/usr/bin/env node

import chalk from 'chalk';
import Table from 'cli-table';
import program from 'commander';
import _ from 'lodash';
import utils from './libs/utils';

const hander = async (domain: string | null = null) => {
  const cloudflre = utils.getCloudflreInstance();
  const records = await cloudflre.getAllDNSRecords(domain);
  const groupedRecords = utils.groupDNSRecords(records);
  let groups = Object.keys(groupedRecords).sort(utils.compareDomains);

  if (domain !== null) {
    const suffix = _.trim(domain, '.');
    groups = groups.filter((group) => group === suffix || group.endsWith('.' + suffix));
  }

  for (const group of groups) {
    console.log(' Domain: ' + chalk.green(group));
    const table = new Table({
      head: ['Type', 'Name', 'Content', 'TTL', 'Proxiable', 'Proxied'],
      colWidths: [10, 21, 41, 5, 11, 9],
      colAligns: ['middle', 'middle', 'middle', 'middle', 'middle', 'middle'],
      style: {
        head: ['cyan'],
      },
    });

    table.push(...groupedRecords[group]
      .sort((a, b) => utils.compareDomains(a.name, b.name))
      .map((record) => {
        return [
          record.type,
          utils.getDomainPrefix(record.name, group),
          record.content,
          record.ttl,
          record.proxiable,
          record.proxied,
        ];
      }));

    console.log(table.toString());
  }
};

program
  .arguments('[domain]')
  .action(hander)
  .parse(process.argv);
