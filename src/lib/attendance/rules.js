import { ATTENDANCE } from '../constants'
import { Rule, createTimeRangeRule } from './rules.factory'

export const RULE = {
  DAYOFF: 'dayoff',
  ONTIME: 'ontime',
  WARNING: 'warning',
  DANGER: 'danger'
}

const dayoff = new Rule(RULE.DAYOFF, (data) => {
  return data.message !== ATTENDANCE.PRESENT
})

/**
 * @type {Rule[]}
 */
const rules = [
  dayoff,
  createTimeRangeRule(RULE.ONTIME, '00:00', '07:30'),
  createTimeRangeRule(RULE.WARNING, '07:30', '09:00'),
  createTimeRangeRule(RULE.DANGER, '09:00', '24:00')
]

/**
 * @param {Object} checkinData - array element of "/attendance" XHR response data.
 * @returns {string[]} matched rule names
 */
export function getMatchedRule (checkinData) {
  let rule
  for (const r of rules) {
    if (r.handler(checkinData)) {
      rule = r.name
      break
    }
  }
  return rule
}
