#!/usr/bin/env node

import program from 'commander'
import utils from './libs/utils'

let hander = () => {
  utils.getConfigInstance().remove()
}

program
  .action(hander)
  .parse(process.argv)
