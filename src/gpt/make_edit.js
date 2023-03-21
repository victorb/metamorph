const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/edit');

async function make_edit(suggested_edit) {
  const messages = [
    {role: "system", content: prompt},
    ...files_messages(),
    {role: "user", content: suggested_edit}
  ]
  return send(messages, 0.3)
}

module.exports = make_edit