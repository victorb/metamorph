const fs = require('fs');

module.exports = () => {
  return fs.readFileSync("./app.js").toString()
}