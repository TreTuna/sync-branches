const core = require("@actions/core");
const github = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  const fromBranch = core.getInput("FROM_BRANCH");
  const toBranch = core.getInput("TO_BRANCH");
  try {
    console.log(`Making a PR to ${toBranch} from ${fromBranch}`);
    const actionContext = JSON.stringify(github.context, undefined, 2);
    console.log(`The event context: ${actionContext}`);

    const myToken = core.getInput("myToken");

    const octokit = new github.GitHub(myToken);

    const { data: pullRequest } = await octokit.pulls.create({
      owner: actionContext.payload.repository.owner,
      repo: actionContext.payload.repository.name,
      title: `sync: ${fromBranch} to ${toBranch}`,
      head: fromBranch,
      base: toBranch
    });

    console.log(pullRequest);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
