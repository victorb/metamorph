const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/edit');
const temperature_setting = require('../utils/temperature_setting');

function adaptive_weight(success_rate) {
  const low_bound_weight = 0.3;
  const high_bound_weight = 1.5;
  const weight = low_bound_weight + (success_rate * (high_bound_weight - low_bound_weight));
  return weight;
}

async function make_edit(suggested_edit, success_rate) {
  const messages = [
    { role: 'system', content: prompt },
    ...files_messages(),
    { role: 'user', content: suggested_edit },
  ];

  const raw_result = await send(messages, temperature_setting.get_temperature());
  const parsed_result = JSON.parse(raw_result);

  // Add confidence scores to the edits
  const result_with_confidence = parsed_result.map((edit) => {
    const confidence = Math.max(
      success_rate,
      Math.random()
    ); // Influencing the confidence value
    const weight = adaptive_weight(success_rate);
    return { ...edit, confidence: confidence * weight };
  });

  return JSON.stringify(result_with_confidence);
}

module.exports = make_edit;