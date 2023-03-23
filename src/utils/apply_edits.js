const fs = require('fs');
const { updateUsageStats } = require('./code_usage_tracker');

function apply_edit(edits) {
  if (edits && Array.isArray(edits)) {
    edits.forEach((edit) => {
      const { filename, contents } = edit;
      if (filename && contents) {
        fs.writeFileSync(filename, contents, 'utf-8');
        console.log('Applied edit to:', filename);
        updateUsageStats(filename); // Add this line to update the usage stats
      }
    });
  }
}

module.exports = apply_edit;