const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/edit');
const temperature_setting = require('../utils/temperature_setting');

async function make_edit(suggested_edit) {
  const messages = [
    {role: "system", content: prompt},
    ...files_messages(),
    {role: "user", content: suggested_edit}
  ]
  
  const raw_result = await send(messages, temperature_setting.get_temperature())
  const parsed_result = JSON.parse(raw_result);
  
  // Add confidence scores to the edits
  const result_with_confidence = parsed_result.map((edit) => {
    const confidence = Math.random(); // Here, we should use AI capability to predict real confidence
    return {...edit, confidence};
  });
  
  return JSON.stringify(result_with_confidence);
}

module.exports = make_edit;