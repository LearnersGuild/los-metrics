import schedule from 'node-schedule'

import computeMetrics from './computeMetrics'

function setupScheduler() {
  // schedule one periodic job, but also run it once (in case data doesn't yet exist)
  schedule.scheduleJob(process.env.COMPUTATION_SCHEDULE, computeMetrics)
  schedule.scheduleJob(new Date(), computeMetrics)
}

setupScheduler()
