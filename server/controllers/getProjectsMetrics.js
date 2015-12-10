import Promise from 'bluebird'
import _ from 'lodash'
import fetch from 'node-fetch'


function filterCardsByDate(analyticsData, startDate, endDate) {
  const recentlyShipped = analyticsData.cardMetricsRecentlyShipped
  const cardsToInclude = _.filter(recentlyShipped, (card) => {
    const shippedAt = new Date(card.shippedAt)
    return (shippedAt >= startDate && shippedAt < endDate)
  })
  // console.log('cardsToInclude:', _.pluck(cardsToInclude, 'title'))

  return cardsToInclude
}

function stageIdsForStageNames(stages, stageNames) {
  const stageIds = _.pluck(
    _.filter(stages, (stage) => {
      return _.include(stageNames, stage.name)
    }),
    'id'
  )
  // console.log('stageIds:', stageIds)

  return stageIds
}

function durationForAllCardsInStageIds(cards, stageIds) {
  const duration = _.reduce(cards, (total, card) => {
    const cardDuration = _.reduce(card.cardInStageMetrics, (cardTotal, stage) => {
      if (_.include(stageIds, stage.stageId)) {
        return cardTotal + parseInt(stage.duration, 10)
      }
      return cardTotal
    }, 0)
    return total + cardDuration
  }, 0)
  // console.log('duration:', duration)

  return duration
}

function averageInDays(duration, numCards) {
  const averageInMilliseconds = Math.round(duration / numCards)
  const average = averageInMilliseconds / (24 * 60 * 60 * 1000)
  // console.log('average:', average)

  return average
}

// Lead Time == Time that elapses from the moment a customer or a user submits
// the work item to a Backlog to the moment they can use it.
function averageLeadTimeDays(cards, stages) {
  if (!cards || !cards.length) {
    return 0
  }

  const stageIdsToInclude = stageIdsForStageNames(stages, [
    'Backlog',
    'To-Do',
    'In-Progress',
  ])

  const duration = durationForAllCardsInStageIds(cards, stageIdsToInclude)
  const average = averageInDays(duration, cards.length)

  return average
}

// Cycle Time == Time that elapses from the moment a team starts actively
// working on a task till the moment they are done.
function averageCycleDays(cards, stages) {
  if (!cards || !cards.length) {
    return 0
  }

  const stageIdsToInclude = stageIdsForStageNames(stages, [
    'To-Do',
    'In-Progress',
  ])

  const duration = durationForAllCardsInStageIds(cards, stageIdsToInclude)
  const average = averageInDays(duration, cards.length)

  return average
}

function getProjectMetrics(projectConfig, startDate, endDate) {
  return new Promise((resolve) => {
    // Query the blossom API. See `docs/sample-blossom-api-analytics.json` for a sample.
    const analyticsUrl = 'https://blossom-hr.appspot.com/_ah/api/blossom/0_0_3/projects/' +
      `${projectConfig.blossomId}/analytics?accessToken=${projectConfig.accessToken}`
    const projectUrl = 'https://blossom-hr.appspot.com/_ah/api/blossom/0_0_3/projects/' +
      `${projectConfig.blossomId}?accessToken=${projectConfig.accessToken}`


    fetch(analyticsUrl)
      .then((res) => res.json())
      .then((analyticsData) => {
        const cardsShippedInTimeframe = filterCardsByDate(analyticsData, startDate, endDate)
        const cycleTime = averageCycleDays(cardsShippedInTimeframe, analyticsData.stages)
        const leadTime = averageLeadTimeDays(cardsShippedInTimeframe, analyticsData.stages)
        const throughput = cardsShippedInTimeframe.length

        // get WIP
        fetch(projectUrl)
          .then((res2) => res2.json())
          .then((projectData) => {
            const stages = projectData.stages
            const wipStages = _.filter(stages, (stage) => {
              return _.include(['To-Do', 'In-Progress'], stage.name)
            })
            const wip = _.reduce(wipStages, (total, stage) => {
              if (!stage.cards) {
                return total
              }
              return total + stage.cards.length
            }, 0)
            // console.log('wip:', wip)

            resolve({
              name: projectConfig.name,
              metrics: {
                cycleTime,
                leadTime,
                throughput,
                wip,
              },
            })
          })
      })
  })
}


export default function getProjectsMetrics(req, res) {
  // Pull the start and end date from query parameters. In the case that they
  // are not passed, the date objects will defualt to today's date. If the
  // startDate ends up not being passed, we'll subtract 7 days from the endDate.
  let { startDate, endDate } = req.query
  startDate = startDate ? new Date(startDate) : new Date()
  endDate = endDate ? new Date(endDate) : new Date()
  if (!req.query.startDate) {
    startDate.setTime(endDate.getTime() - (24 * 60 * 60 * 7 * 1000))
  }
  // console.log('startDate:', startDate, 'endDate:', endDate)

  // TODO: this should not be hardcoded; waiting on API from Blossom
  const projectsConfig = [
    {
      name: 'IDM',
      blossomId: 'shu6czxit5ecvnpg2tw6p2fh4q',
      accessToken: 'aiaxztyfk5erzdtfhpous2ywzy',
    },
    {
      name: 'icons',
      blossomId: 'wq6b222ahndb5flclk533xdsti',
      accessToken: 'akpd7f3ckvdzpjlhzxcbdabdhi',
    },
  ]
  const allProjectsPromises = _.map(projectsConfig, (projectConfig) => getProjectMetrics(projectConfig, startDate, endDate))
  Promise.all(allProjectsPromises)
    .then((projectsMetrics) => {
      res.status(200).json(projectsMetrics)
    })
}
