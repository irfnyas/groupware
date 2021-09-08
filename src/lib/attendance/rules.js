import _inRange from 'lodash/inRange'
import addMinutes from 'date-fns/addMinutes'
import { RULE } from './enums'
import { ATTENDANCE } from '../constants'

/**
 * Rule handler.
 * @callback RuleHandler
 * @param {Object} checkinData - array element of "/attendance" XHR response data.
 * @returns {boolean}
 */

/**
 * Rule definition.
 * @typedef {Object} Rule
 * @property {string} [name]
 * @property {RuleHandler} handler
 */

/**
 * Time range rule factory.
 * @param {string} start - HH:MM format
 * @param {string} end - HH:MM format
 * @returns {Rule}
 */
function createTimeRangeRule (name, start, end) {
  return {
    name,
    handler (checkinData) {
      const { startDate } = checkinData
      const value = new Date(startDate).setSeconds(0, 0)
      const rangeStart = new Date(startDate).setHours(
        ...start.split(':'),
        0,
        0
      )
      const rangeEnd = new Date(startDate).setHours(
        ...end.split(':'),
        0,
        0
      )

      // no need to worry of clash between rules
      // due to lodash/inRange is non-inclusive of rangeEnd
      return _inRange(
        +value,
        addMinutes(+rangeStart, 1),
        addMinutes(+rangeEnd, 1)
      )
    }
  }
}

/**
 * If rule is not a type of time range rule,
 * rules must be ordered based on priority,
 * since rule is matched using match-first strategy.
 *
 * For example, dayoff should come before exception for MO.
 * @type {Rule[]}
 */
const rules = [
  {
    name: RULE.DAYOFF,
    handler (checkinData) {
      return checkinData.message !== ATTENDANCE.PRESENT
    }
  },
  {
    name: RULE.EXCEPTION_MO,
    handler (checkinData) {
      // TODO: shouldn't be determined by string matching
      return checkinData.jabatan === 'Monitoring Officer'
    }
  },
  createTimeRangeRule(RULE.ONTIME, '00:00', '07:30'),
  createTimeRangeRule(RULE.WARNING, '07:30', '09:00'),
  createTimeRangeRule(RULE.DANGER, '09:00', '24:00')
]

/**
 * @param {Date} checkinDate
 * @returns {string | undefined} matched rule name
 */
export function validate (checkinDate) {
  let result
  for (const rule of rules) {
    if (rule.handler(checkinDate)) {
      result = rule.name
      break
    }
  }
  return result
}
