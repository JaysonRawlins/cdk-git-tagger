import { awscdk, DependencyType, TextFile } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { NpmAccess } from 'projen/lib/javascript';

const cdkCliVersion = '2.1029.2';
const minNodeVersion = '20.0.0';
const devNodeVersion = '20.19.0';
const workflowNodeVersion = '20.x';
const jsiiVersion = '^5.8.0';
const cdkVersion = '2.85.0'; // Minimum CDK Version Required
const minProjenVersion = '0.98.10'; // Does not affect consumers of the library
const minConstructsVersion = '10.0.5'; // Minimum version to support CDK v2 and does affect consumers of the library
const devConstructsVersion = '10.0.5'; // Pin for local dev/build to avoid jsii type conflicts
const awsConfigureCredentialsVersion = 'v5';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Jayson Rawlins',
  description: 'CDK Aspect to tag resources with git metadata.  This provides a nice connection between the construct and the git repository.',
  authorAddress: 'JaysonJ.Rawlins@gmail.com',
  keywords: [
    'cdk',
    'git',
    'tagger',
    'tag',
    'metadata',
  ],
  cdkVersion: cdkVersion,
  cdkCliVersion: cdkCliVersion,
  projenVersion: `^${minProjenVersion}`,
  defaultReleaseBranch: 'main',
  minNodeVersion: minNodeVersion,
  jsiiVersion: jsiiVersion,
  name: '@jjrawlins/cdk-git-tagger',
  workflowBootstrapSteps: [
    {
      name: 'configure aws credentials',
      uses: `aws-actions/configure-aws-credentials@${awsConfigureCredentialsVersion}`,
      with: {
        'role-to-assume': '${{ secrets.AWS_GITHUB_OIDC_ROLE }}',
        'role-duration-seconds': 900,
        'aws-region': '${{ secrets.AWS_GITHUB_OIDC_REGION }}',
        'role-skip-session-tagging': true,
        'role-session-name': 'GitHubActions',
      },
    },
  ],
  npmAccess: NpmAccess.PUBLIC,
  npmProvenance: true, // Enable npm provenance attestations
  npmTrustedPublishing: true, // Use OIDC for npm publishing (eliminates NPM_TOKEN secret)
  projenrcTs: true,
  repositoryUrl: 'https://github.com/JaysonRawlins/cdk-git-tagger.git',
  githubOptions: {
    projenCredentials: GithubCredentials.fromApp({
      appIdSecret: 'PROJEN_APP_ID',
      privateKeySecret: 'PROJEN_APP_PRIVATE_KEY',
    }),
    mergify: false,
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: [
          'feat',
          'fix',
          'docs',
          'style',
          'refactor',
          'perf',
          'test',
          'chore',
          'revert',
          'ci',
          'build',
          'deps',
          'wip',
          'release',
        ],
      },
    },
  },
  depsUpgrade: true,
  publishToNuget: {
    packageId: 'JJRawlins.CdkGitTagger',
    dotNetNamespace: 'JJRawlins.CdkGitTagger',
  },
  publishToPypi: {
    distName: 'jjrawlins-cdk-git-tagger',
    module: 'jjrawlins_cdk_git_tagger',
  },
  publishToGo: {
    moduleName: 'github.com/JaysonRawlins/cdk-git-tagger',
    packageName: 'cdkgittagger',
  },
  peerDeps: [
    `aws-cdk-lib@>=${cdkVersion} <3.0.0`,
    `constructs@>=${minConstructsVersion} <11.0.0`,
  ],
  deps: [

  ],
  devDeps: [
    `aws-cdk@${cdkCliVersion}`,
    `aws-cdk-lib@${cdkVersion}`,
    '@types/fs-extra',
    '@types/node',
    '@types/lodash',
    'fs-extra',
    'glob',
  ],
  eslint: true,
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
      rootDir: './',
    },
    include: ['src/**/*.ts', 'test/**/*.ts'],
  },
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
      rootDir: './',
    },
    include: ['src/**/*.ts', 'test/**/*.ts'],
  },
  jest: true,
  jestOptions: {
    jestConfig: {
      moduleNameMapper: {
        '^aws-cdk-lib/(.*)$': '<rootDir>/node_modules/aws-cdk-lib/$1',
      },
      moduleDirectories: ['node_modules'],
      testEnvironment: 'node',
      transformIgnorePatterns: [
        'node_modules/(?!(aws-cdk-lib)/)',
      ],
    },
  },
});

// Add Yarn resolutions to ensure patched transitive versions
project.package.addField('resolutions', {
  'brace-expansion': '1.1.12',
  'form-data': '^4.0.4',
  '@eslint/plugin-kit': '^0.3.4',
  'aws-cdk-lib': `>=${cdkVersion} <3.0.0`,
  // Pin constructs for local dev/build to a single version to avoid jsii conflicts
  'constructs': devConstructsVersion,
  'projen': `>=${minProjenVersion} <1.0.0`,
});

// Allow any Node 20.x for consumers.
project.package.addField('engines', {
  node: `>=${minNodeVersion} <21`,
});

// Add JSII configuration to handle aws-cdk-lib dependency
project.package.addField('bundledDependencies', ['aws-cdk-lib']);

project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.steps.2.with.node-version', workflowNodeVersion);
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.id-token', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.packages', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.pull-requests', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.contents', 'write');

project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.id-token', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.packages', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.pull-requests', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.contents', 'write');

// Add auto-merge step to upgrade-main workflow (step index 6, after PR creation)
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.steps.6', {
  name: 'Enable auto-merge',
  if: "steps.create-pr.outputs.pull-request-number != ''",
  run: 'gh pr merge --auto --squash "${{ steps.create-pr.outputs.pull-request-number }}"',
  env: {
    GH_TOKEN: '${{ steps.generate_token.outputs.token }}',
  },
});

/**
 * For the build job, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
 * This is needed to be able to install dependencies from GitHub Packages during the build.
 */
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.packages', 'read');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.steps.2.with.node-version', workflowNodeVersion);

/**
 * For the package jobs, we need to be able to write to packages and also need id-token permissions for OIDC to authenticate to the registry.
 */
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-js.permissions.id-token', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-js.permissions.packages', 'write');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-python.permissions.packages', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-python.permissions.id-token', 'write');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-go.permissions.packages', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-go.permissions.id-token', 'write');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-dotnet.permissions.packages', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-dotnet.permissions.id-token', 'write');

/** * For the release jobs, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
 */
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.contents', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.steps.3.with.node-version', workflowNodeVersion);
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_github.steps.0.with.node-version', workflowNodeVersion);

// Override node-version to 24 for npm Trusted Publishing (requires npm CLI 11.5.1+)
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.steps.0.with.node-version', '24');
// Add --ignore-engines to yarn install since Node 24 is outside the engines range (20.x)
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && yarn install --check-files --frozen-lockfile --ignore-engines');

// Override node-version for publish jobs that default to minNodeVersion (20.0.0)
// @eslint/plugin-kit@0.3.5 requires Node ^20.9.0, so 20.0.0 fails yarn install
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.steps.0.with.node-version', workflowNodeVersion);
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_nuget.steps.0.with.node-version', workflowNodeVersion);
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.steps.0.with.node-version', workflowNodeVersion);

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_nuget.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_nuget.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_nuget.permissions.contents', 'write');

// Prevent release workflow from triggering on Go module commits
project.github!.tryFindWorkflow('release')!.file!.addOverride('on.push.paths-ignore', [
  'cdkgittagger/**',
]);

new TextFile(project, '.tool-versions', {
  lines: [
    '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".',
    `nodejs ${devNodeVersion}`,
    'yarn 1.22.22',
  ],
});


// Ensure 'constructs' is only a peer dependency (avoid duplicates that cause jsii conflicts)
project.deps.removeDependency('constructs');
project.deps.addDependency(`constructs@>=${minConstructsVersion} <11.0.0`, DependencyType.PEER);

// Projen creates this incorrectly
// Removing to keep linter happy
project.compileTask.exec('rm -r tsconfig.json');

project.synth();
