# Next.js Upgrade Plan

Target: Upgrade to Next.js 15.x (done in main branch)

Steps:
- Create a feature branch `upgrade/next-15` (recommended)
- Update `package.json` to `next@15.5.0` (already applied)
- Run `npm install` and `npm run build` to surface breaking changes
- Run full test suite and manual smoke tests
- Adjust any API differences (server actions, image optimization config)
- Merge once CI is green

Notes:
- We upgraded on `main` during initial remediation for speed; ideally this should be done in a branch and validated with tests.
