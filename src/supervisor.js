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
    if (was_successful) {
      let new_version = full_program();
      did_revert = false

      if (old_version !== new_version) {
        saveChanges();
        console.log('Changes saved');
      } else {
        console.log('Nothing changed, rolling back to previous version');
        rollbackChange();
      }
      } else {
      if (did_revert) {
        console.log("Rolling back one commit...");
        rollbackChange()
        did_revert = false
      } else {
        revertChanges();
        console.log('Changes reverted... Trying again from the beginning');
        did_revert = true;
      }
    }
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