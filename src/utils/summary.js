function display_summary(successful_edits, unsuccessful_edits) {
  const total_edits = successful_edits + unsuccessful_edits;
  const success_rate = (successful_edits / total_edits) * 100;

  console.log('\n### Summary of Program Edits ###');
  console.log(`Total Successful Edits: ${successful_edits}`);
  console.log(`Total Unsuccessful Edits: ${unsuccessful_edits}`);
  console.log(`Overall Success Rate: ${success_rate.toFixed(2)}%`);
  console.log('###############################\n');
}

module.exports = display_summary;