
/**
 * Static dictionary of allowed Device Statuses (Read-Only Enum)
 */
export const DEVICE_STATUS = Object.freeze({
  ACTIVE: 'active',
  COOLING: 'cooling',
  HEATING: 'heating',
  STANDBY: 'standby',
  CHARGING: 'charging',
  OFF: 'off'
});
/**
 * Static dictionary of allowed Device Material Symbols (Read-Only Enum)
 */
export const DEVICE_ICONS = Object.freeze({
  FAN: 'mode_fan',
  AC: 'ac_unit',
  TV: 'tv',
  LIGHTBULB: 'lightbulb',
  POWER: 'power',
  THERMOSTAT: 'thermostat',
  ROUTER: 'router',
  SPEAKER: 'speaker',
  SECURITY: 'security',
  WATER_DROP: 'water_drop',
  TUBELIGHT: 'fluorescent',
  WATER_HEATER: 'water_heater'
});

/**
 * Handy flat array of all icon strings for dynamic lookup validation
 * @type {Array<string>}
 */
export const ALL_DEVICE_ICONS = Object.freeze(Object.values(DEVICE_ICONS));
