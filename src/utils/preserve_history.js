const fs = require('fs');

module.exports = (proposal, expanded, edits, successful_edits, unsuccessful_edits) => {
  const history = JSON.parse(fs.readFileSync('./history.json'));
  history.push({
    proposal,
    expanded,
    edits,
    successful_edits,
    unsuccessful_edits
  });
  fs.writeFileSync('./history.json', JSON.stringify(history, null, 2))
}