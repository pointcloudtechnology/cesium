# Contributions of PCT

## Rules for contributions of PCT

- We use our own `main` branch.
- This `main` branch is rebased on the `main` branch of the original repo regularly.
- Unless a new Cesium release (in the original repo) is planned in the near future, we always base our `main` branch on the state of the current release.
- When we release a version of our fork, it is always based on a version that is already released by Cesium.
  - This means we don't add stuff from the current original main branch if this stuff is not yet released in the original repo.
- This `main` branch is protected and we never directly push to it.
- Instead, we create pull requests against this `main` branch.
- Every PR adds only exactly one commit (all changes of this PR squashed into one commit).
- The PR commit has a message that explains what the change does and always starts with `PCT:` to allow easy search for those commits later.

## PRs of PCT that were added in this fork

Allow VEC3 uniforms to be transformed into model coordinates (#1)
