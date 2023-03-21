const axios = require('axios');
const sleep = require('../utils/sleep');

async function send(messages, temperature = 1.0, retries = 3, initialBackoff = 3000) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
  const data = {
    model: "gpt-4",
    messages: messages,
    temperature: temperature,
  };

  try {
    const response = await axios.post(url, data, { headers: headers });
    const choice = response.data.choices[0];
    return choice.message.content;
  } catch (error) {
    if (error.response) {
      console.log('Error: ' + error.response.status);
      console.log(error.response.data);
    }

    if (error.response && error.response.status === 429) {
      if (retries > 0) {
        const backoff = initialBackoff * 2 ** (3 - retries);
        console.log(`Waiting for ${backoff}ms before retrying...`);
        await sleep(backoff);
        console.log('Retrying now...');
        return send(messages, temperature, retries - 1, initialBackoff);
      } else {
        throw new Error("Max retries reached, unable to send request.");
      }
    } else {
      throw error;
    }
  }
}

module.exports = send;