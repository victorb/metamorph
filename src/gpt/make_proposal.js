const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/proposer');
const temperature_setting = require('../utils/temperature_setting');

async function make_proposal() {
  const messages = [
    {role: "system", content: prompt},
    ...files_messages(),
    {role: "user", content: "Suggest the next feature improvement within the objectives and constraints that the AI should implement."}
  ]
  return send(messages, temperature_setting.get_temperature())
}

module.exports = make_proposal;