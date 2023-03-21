const fs = require('fs');

module.exports = (proposal, expanded, edits) => {
  const history = JSON.parse(fs.readFileSync('./history.json'));
  history.push({proposal, expanded, edits});
  fs.writeFileSync('./history.json', JSON.stringify(history, null, 2))
}
