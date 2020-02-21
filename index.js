const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  const fromBranch = core.getInput("FROM_BRANCH", { required: true });
  const toBranch = core.getInput("TO_BRANCH", { required: true });
  const githubToken = core.getInput("GITHUB_TOKEN", { required: true });

  try {
    console.log(`Making a pull request to ${toBranch} from ${fromBranch}.`);

    const {
      payload: { repository }
    } = github.context;

    const octokit = new github.GitHub(githubToken);

    const { data: currentPulls } = await octokit.pulls.list({
      owner: repository.owner.name,
      repo: repository.name
    });

    console.log("💣🔥>>>>>>>: run -> currentPulls", currentPulls);

    const { data: pullRequest } = await octokit.pulls.create({
      owner: repository.owner.login,
      repo: repository.name,
      title: `sync: ${fromBranch} to ${toBranch}`,
      head: fromBranch,
      base: toBranch
    });

    console.log(
      `Pull request successful! You can see it here: ${pullRequest.url}.`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
