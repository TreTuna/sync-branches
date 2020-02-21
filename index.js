const core = require("@actions/core");
const github = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  const fromBranch = core.getInput("fromBranch");
  const toBranch = core.getInput("toBranch");
  try {
    console.log(`Making a PR to ${toBranch} from ${fromBranch}`);
    const payload = JSON.stringify(github.context, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
