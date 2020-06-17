const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const fromBranch = core.getInput("FROM_BRANCH", { required: true });
    const toBranch = core.getInput("TO_BRANCH", { required: true });
    const mainBranch = core.getInput("MAIN_BRANCH", { required: true });
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
    const requiredLabel = core.getInput("REQUIRED_LABEL", { required: true });
    const pullRequestTitle = core.getInput("PULL_REQUEST_TITLE");
    const pullRequestBody = core.getInput("PULL_REQUEST_BODY");
    const pullRequestIsDraft = core.getInput("PULL_REQUEST_IS_DRAFT").toLowerCase() === "true";

    const {
      payload: { repository }
    } = github.context;

    const octokit = new github.GitHub(githubToken);

    const { data: currentPulls } = await octokit.pulls.list({
      owner: repository.owner.login,
      repo: repository.name
    });

    const sourcePull = currentPulls.find(pull => {
      return pull.head.ref === fromBranch && pull.base.ref === mainBranch;
    });

    const labels = sourcePull.labels;
    const existingLabels = labels.filter(p => p.name == requiredLabel);

    if ( existingLabels.length === 0 ) {
      console.log(`PR does not have the label ${requiredLabel}`);
      throw "Required label does not exist for the PR";
    }

    // Remove the label from PR.
    await octokit.issues.removeLabel({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: sourcePull.number,
      name: requiredLabel
    });

    console.log(`Making a pull request to ${toBranch} from ${fromBranch}.`);

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
          : `sync-branches: Merge #${sourcePull.number} to ${toBranch}`,
        draft: pullRequestIsDraft
      });

      console.log(
        `Pull request (${pullRequest.number}) successful! You can view it here: ${pullRequest.url}.`
      );

      core.setOutput("PULL_REQUEST_URL", pullRequest.url.toString());
      core.setOutput("PULL_REQUEST_NUMBER", pullRequest.number.toString());
    } else {
      console.log(
        `There is already a pull request (${currentPull.number}) to ${toBranch} from ${fromBranch}.`,
        `You can view it here: ${currentPull.url}`
      );

      core.setOutput("PULL_REQUEST_URL", currentPull.url.toString());
      core.setOutput("PULL_REQUEST_NUMBER", currentPull.number.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
