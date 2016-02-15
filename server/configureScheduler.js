import schedule from 'node-schedule'

import computeMetrics from './computeMetrics'

function setupScheduler() {
  // schedule one periodic job, but also run it once (in case data doesn't yet exist)
  const inABit = new Date(new Date().getTime() + 15000)
  schedule.scheduleJob(process.env.COMPUTATION_SCHEDULE, computeMetrics)
  if (process.env.NODE_ENV === 'production') {
    schedule.scheduleJob(inABit, computeMetrics)
  }
}

setupScheduler()
