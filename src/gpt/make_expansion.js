const send = require('./send');
const files_messages = require('./files_messages');
const prompt = require('../prompts/expander');

async function make_proposal(proposal) {
  const messages = [
    {role: "system", content: prompt},
    ...files_messages(),
    {role: "user", content: "Expand this proposal so GPT could implement it:\n\n" + proposal}
  ]
  return send(messages, 1.0)
}

module.exports = make_proposal
