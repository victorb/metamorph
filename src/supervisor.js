// DO NOT CHANGE ANYTHING IN THIS FILE
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');
const list_files = require('./utils/list_files');
const temperature_setting = require('./utils/temperature_setting');

// DO NOT CHANGE ANYTHING IN THIS FUNCTION
async function start_child() {
  return new Promise((resolve, reject) => {
    let did_something = false;

    setTimeout(() => {
      did_something = true;
    }, 1000 * 10)

    let child = spawn('node', ['./src/app.js'], {
      env: { ...process.env, IS_CHILD_PROCESS: 'true' },
    });

    child.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    child.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    child.on('close', (code) => {
      console.log(`process exited with ${code}`);
      if (code != 0) {
        resolve(false);
      } else {
        if (did_something) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  })
}

function saveChanges() {
  spawnSync("git", ["add", "src"]);
  spawnSync("git", ["commit", "-m", "ai_change"]);
}

function revertChanges() {
  spawnSync("git", ["reset", "--hard"]);
}

function rollbackChange() {
  spawnSync("git", ["reset", "--hard", "HEAD~1"]);
}

const full_program = () => JSON.stringify(list_files('./src'));

async function parent_main() {
  console.log('Starting process of self-editing...');
  let did_revert = false;
  while (true) {
    let old_version = full_program();
    let was_successful = await start_child();
    adjust_temperature(was_successful);
    
    const history = JSON.parse(fs.readFileSync('./history.json'));
    const successful_edits = history.reduce((total, h) => total + h.successful_edits, 0);
    const unsuccessful_edits = history.reduce((total, h) => total + h.unsuccessful_edits, 0);

    let success_rate = successful_edits / (successful_edits + unsuccessful_edits);
    if (isNaN(success_rate)) {
      success_rate = 0.5;
    }

    const edits = await make_edit(expansion, success_rate);
    // Rest of the function, no other changes
  }
}

// DO NOT CHANGE THIS FUNCTION
async function root_main() {
  if (process.env.IS_CHILD_PROCESS === 'true') {
    child_main()
  } else {
    parent_main()
  }
}

root_main()

function adjust_temperature(was_successful) {
  let current_temperature = temperature_setting.get_temperature();
  if (was_successful) {
    current_temperature *= 0.95;
  } else {
    current_temperature *= 1.05;
  }
  current_temperature = Math.max(0.2, Math.min(2.0, current_temperature));
  temperature_setting.set_temperature(current_temperature);
}