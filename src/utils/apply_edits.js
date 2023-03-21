const fs = require('fs');

function apply_edit(edits) {
  if (edits && Array.isArray(edits)) {
    edits.forEach((edit) => {
      const { filename, contents } = edit;
      if (filename && contents) {
        fs.writeFileSync(filename, contents, 'utf-8');
        console.log('Applied edit to:', filename);
      }
    });
  }
}

module.exports = apply_edit;