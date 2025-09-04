import { awscdk } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { NpmAccess } from 'projen/lib/javascript';

const cdkVersion = '2.150.0';
const minNodeVersion = '22.x';
const jsiiVersion = '~5.8.0';
const constructsVersion = '10.4.2';
const projenVersion = '^0.95.4';
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
  constructsVersion: constructsVersion,
  projenVersion: projenVersion,
  projenDevDependency: false,
  defaultReleaseBranch: 'main',
  minNodeVersion: minNodeVersion,
  jsiiVersion: jsiiVersion,
  name: '@jjrawlins/cdk-git-tagger',
  workflowBootstrapSteps: [
    {
      name: 'configure aws credentials',
      uses: 'aws-actions/configure-aws-credentials@v4',
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
  publishToPypi: {
    distName: 'jjrawlins_cdk-git-tagger',
    module: 'jjrawlins_cdk_git_tagger',
  },
  publishToGo: {
    moduleName: 'github.com/JaysonRawlins/cdk-git-tagger',
    packageName: 'cdk-git-tagger',
  },
  deps: [
    'projen',
    'aws-cdk-lib',
    'constructs',
  ],
  devDeps: [
    '@types/fs-extra',
    'aws-cdk',
    'fs-extra',
    'glob',
  ],
  peerDeps: [
    `aws-cdk-lib@^${cdkVersion}`,
    `constructs@^${constructsVersion}`,
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
  'constructs': constructsVersion,
});

project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.id-token', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.packages', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.pull-requests', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.upgrade.permissions.contents', 'write');

project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.id-token', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.packages', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.pull-requests', 'write');
project.github!.tryFindWorkflow('upgrade-main')!.file!.addOverride('jobs.pr.permissions.contents', 'write');

/**
 * For the build job, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
 * This is needed to be able to install dependencies from GitHub Packages during the build.
 */
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.packages', 'read');

/**
 * For the package jobs, we need to be able to write to packages and also need id-token permissions for OIDC to authenticate to the registry.
 */
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-js.permissions.id-token', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-js.permissions.packages', 'write');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-python.permissions.packages', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-python.permissions.id-token', 'write');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-go.permissions.packages', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.package-go.permissions.id-token', 'write');


/** * For the release jobs, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
 */
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_npm.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_pypi.permissions.contents', 'write');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.id-token', 'write');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.packages', 'read');
project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_golang.permissions.contents', 'write');


// Projen creates this incorrectly
// Removing to keep linter happy
project.compileTask.exec('rm -r tsconfig.json');

project.synth();
