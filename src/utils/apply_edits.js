const fs = require('fs');

function apply_edit(edits_with_confidence) {
  if (edits_with_confidence && Array.isArray(edits_with_confidence)) {
    // Sort edits in descending order by confidence score
    const sorted_edits = edits_with_confidence.sort((a, b) => b.confidence - a.confidence);
    
    sorted_edits.forEach((edit) => {
      const { filename, contents, confidence } = edit;
      if (filename && contents) {
        fs.writeFileSync(filename, contents, 'utf-8');
        console.log(`Applied edit to: ${filename} (Confidence: ${confidence})`);
      }
    });
  }
}

module.exports = apply_edit;