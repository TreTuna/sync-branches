const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const fromBranch = core.getInput("FROM_BRANCH", { required: true });
    const toBranch = core.getInput("TO_BRANCH", { required: true });
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
    const pullRequestTitle = core.getInput("PULL_REQUEST_TITLE");
    const pullRequestBody = core.getInput("PULL_REQUEST_BODY");
    const pullRequestIsDraft = core.getInput("PULL_REQUEST_IS_DRAFT");

    console.log(`Making a pull request to ${toBranch} from ${fromBranch}.`);

    const {
      payload: { repository }
    } = github.context;

    const octokit = new github.GitHub(githubToken);

    const { data: currentPulls } = await octokit.pulls.list({
      owner: repository.owner.name,
      repo: repository.name
    });

    const currentPull = currentPulls.find(pull => {
      return pull.head.ref === fromBranch && pull.base.ref === toBranch;
    });

    if (!currentPull) {
      const { data: pullRequest } = await octokit.pulls.create({
        owner: repository.owner.login,
        repo: repository.name,
        head: fromBranch,
        base: toBranch,
        title: pullRequestTitle
          ? pullRequestTitle
          : `sync: ${fromBranch} to ${toBranch}`,
        body: pullRequestBody
          ? pullRequestBody
          : `sync-branches: New code has just landed in ${fromBranch}, so let's bring ${toBranch} up to speed!`,
        draft: pullRequestIsDraft === 'y'
      });

      console.log(
        `Pull request successful! You can view it here: ${pullRequest.url}.`
      );

      core.setOutput("PULL_REQUEST_URL", pullRequest.url);
    } else {
      console.log(
        `There is already a pull request to ${toBranch} from ${fromBranch}.`,
        `You can view it here: ${currentPull.url}`
      );

      core.setOutput("PULL_REQUEST_URL", currentPull.url);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
