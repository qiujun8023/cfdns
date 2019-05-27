#!/usr/bin/env node

import program from 'commander'

program
  .version('0.0.1')
  .command('login <email> <key>', 'Login Cloudflare with email and key')
  .command('logout', 'Logout Cloudflare')
  .command('list [domain]', 'List all DNS records')
  .command('add <name> <type> <value>', 'Add a DNS record')
  .command('modify <name> [new_content]', 'Modify a DNS record')
  .command('remove <name> [content]', 'Remove a DNS record')
  .parse(process.argv)
