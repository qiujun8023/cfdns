#!/usr/bin/env node

import program from 'commander';

program
  .version('1.0.0')
  .command('login <email> <key>', 'login Cloudflare with email and key')
  .command('logout', 'logout Cloudflare')
  .command('list [domain]', 'list all DNS records')
  .command('add <name> <type> <content>', 'add a DNS record')
  .command('modify <name> [new_content]', 'modify a DNS record')
  .command('remove <name> [content]', 'remove a DNS record')
  .parse(process.argv);
