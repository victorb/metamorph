const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/expander');
const temperature_setting = require('../utils/temperature_setting');

async function make_proposal(proposal) {
  const messages = [
    {role: "system", content: prompt},
    ...files_messages(),
    {role: "user", content: "Expand this proposal so GPT could implement it:\n\n" + proposal}
  ]
  return send(messages, temperature_setting.get_temperature())
}

module.exports = make_proposal