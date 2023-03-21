const list_files = require('../utils/list_files');

module.exports = () => {
  const files = list_files('src/');

  const messages = [];

  files.forEach((file) => {
    messages.push({
      role: "user",
      content: `File ${file.filename} has the following contents: ${file.contents}`
    })
  });

  return messages
}