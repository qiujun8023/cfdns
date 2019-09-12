#!/usr/bin/env node

import program from 'commander';
import Cloudflre from './libs/cloudflre';
import utils from './libs/utils';

const hander = async (email: string, key: string) => {
  const cloudflre = new Cloudflre(email, key);

  try {
    await cloudflre.getZones();
    utils.getConfigInstance().save({ email, key });
  } catch (e) {
    console.error('Invalid Email or Key.');
  }
};

program
  .arguments('<email> <key>')
  .action(hander)
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}
