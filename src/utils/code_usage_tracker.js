const fs = require('fs');

const getUsageStats = () => {
  try {
    return JSON.parse(fs.readFileSync('./usage_stats.json', 'utf-8'));
  } catch (error) {
    return {};
  }
};

const updateUsageStats = (filename) => {
  const usageStats = getUsageStats();
  usageStats[filename] = (usageStats[filename] || 0) + 1;
  fs.writeFileSync('./usage_stats.json', JSON.stringify(usageStats, null, 2));
};

const getFrequentlyUsedFiles = (threshold) => {
  const usageStats = getUsageStats();
  const frequentlyUsedFiles = Object.entries(usageStats)
    .filter(([_, count]) => count >= threshold)
    .map(([filename, _]) => filename);

  return frequentlyUsedFiles;
};

module.exports = { updateUsageStats, getFrequentlyUsedFiles };