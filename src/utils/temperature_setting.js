let temperature = 1.0;

function get_temperature() {
  return temperature;
}

function set_temperature(new_temperature) {
  temperature = new_temperature;
}

module.exports = { get_temperature, set_temperature };