# sync-branches

GitHub Action to sync one branch when another is updated.

## Inputs

### `GITHUB_TOKEN`

**Required** The token to be used for creating the pull request.

### `FROM_BRANCH`

**Required** The branch you want to make the pull request from.

### `TO_BRANCH`

**Required** The branch you want to make the pull request to.

## Example usage

```YML
- name: Opening pull request
  id: pull
  uses: tretuna/sync-branches@v1
  with:
    GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
    FROM_BRANCH: "master"
    TO_BRANCH: "develop"
```
