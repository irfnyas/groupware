import _inRange from 'lodash/inRange'
import addMinutes from 'date-fns/addMinutes'

/**
 * Rule handler.
 * @callback  RuleHandler
 * @param     {Object} checkinData - array element of "/attendance" XHR response data.
 * @returns   {boolean}
 */

/**
 * Rule constructor.
 * @param {Object}      opts
 * @param {string}      opts.name     - rule name
 * @param {RuleHandler} opts.handler  - handler
 */
export function Rule ({ name, handler } = {}) {
  this.name = name
  this.handler = handler
  return this
}

/**
 * Time range rule factory.
 * @param {string} name   - rule name
 * @param {string} start  - HH:MM format
 * @param {string} end    - HH:MM format
 * @returns {Rule}
 */
export function createTimeRangeRule (name, start, end) {
  return {
    name,
    handler (checkinData) {
      const { startDate } = checkinData
      const value = new Date(startDate).setSeconds(0, 0)
      const rangeStart = new Date(startDate).setHours(...start.split(':'), 0, 0)
      const rangeEnd = new Date(startDate).setHours(...end.split(':'), 0, 0)

      return _inRange(
        +value,
        addMinutes(+rangeStart, 1),
        addMinutes(+rangeEnd, 1)
      )
    }
  }
}
