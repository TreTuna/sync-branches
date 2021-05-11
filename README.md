# sync-branches

GitHub Action to sync one branch when another is updated.

## Inputs

### `GITHUB_TOKEN`

**Required** The token to be used for creating the pull request. Can be set to the one given for the workflow or another user.

### `FROM_BRANCH`

**Required** The branch you want to make the pull request from.

### `TO_BRANCH`

**Required** The branch you want to make the pull request to.

### `PULL_REQUEST_TITLE`

What you would like as the title of the pull request.

Default: `sync: {FROM_BRANCH} to {TO_BRANCH}`

### `PULL_REQUEST_BODY`

What you would like in the body of the pull request.

Default: `sync-branches: New code has just landed in {FROM_BRANCH} so let's bring {TO_BRANCH} up to speed!`

### `PULL_REQUEST_IS_DRAFT`

Set to `true` for the pull request to be opened as a draft.

Default: `false`

### `CONTENT_COMPARISON`

Set to `true` to force checking content comparison between branches.
No more empty pull requests being opened and triggering CI jobs.

Default: `false`

## Outputs

### `PULL_REQUEST_URL`

Set to the URL of either the pull request that was opened by this action or the one that was found to already be open between the two branches.


### `PULL_REQUEST_NUMBER`

Pull request number from generated pull request or the currently open one

## Example usage

```YML
name: Sync
on:
  push:
    branches:
      - master

jobs:
  sync-branches:
    runs-on: ubuntu-latest
    name: Syncing branches
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Set up Node
        uses: actions/setup-node@v1
        with:
          node-version: 12
      - name: Opening pull request
        id: pull
        uses: tretuna/sync-branches@1.3.0
        with:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
          FROM_BRANCH: "master"
          TO_BRANCH: "develop"
```
