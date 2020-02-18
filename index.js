const puppeteer = require('puppeteer')
const perf = require('execution-time')()
const chalk = require('chalk')
const emoji = require('node-emoji')
require('dotenv').config()

const log = console.log

const site = process.env.URL

perf.start()

log(`${emoji.find('truck').emoji} Checking if cups are in stock yet`)

puppeteer
  .launch()
  .then(async browser => {
    const page = await browser.newPage()
    await page.goto(site)

    const available = await page.$eval(
      '#availability_feature_div p.a-spacing-micro',
      el => el.textContent
    )

    await browser.close()

    log(
      `\n${emoji.find('coffee').emoji} Cups are ${
        available.includes('nicht') ? chalk.red('not available') : chalk.green('available')
      }`
    )

    const execTime = perf.stop()
    const execSec = execTime.time / 1000
    log(`\n${emoji.find('sparkles').emoji} Finished in ${execSec.toFixed(2)}s`)
  })
  .catch(err => {
    console.log(err)
  })
