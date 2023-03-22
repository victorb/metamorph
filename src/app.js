const make_proposal = require('./gpt/make_proposal');
const make_expansion = require('./gpt/make_expansion');
const make_edit = require('./gpt/make_edit');
const apply_edits = require('./utils/apply_edits');
const preserve_history = require('./utils/preserve_history');
const temperature_setting = require('./utils/temperature_setting');

let successful_edits = 0;
let unsuccessful_edits = 0;

async function main() {
  console.log('### Crafting proposal ###');
  const proposal = await make_proposal();
  console.log(proposal);
  console.log('### Expanding proposal ###');
  const expansion = await make_expansion(proposal);
  console.log(expansion);
  console.log('### Creating edits ###');
  const edits = await make_edit(expansion, successful_edits / (successful_edits + unsuccessful_edits));
  console.log(edits);
  const parsed_edits = JSON.parse(edits);
  console.log('# of edits: ' + parsed_edits.length);
  console.log('### Applying edits');
  apply_edits(parsed_edits);
  successful_edits += parsed_edits.filter(edit => edit.confidence > 0.8).length;
  unsuccessful_edits += parsed_edits.filter(edit => edit.confidence <= 0.8).length;

  preserve_history(proposal, expansion, edits, successful_edits, unsuccessful_edits);
  console.log('### All done!');
}

main()