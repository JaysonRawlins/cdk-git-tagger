import { awscdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const cdkVersion = '2.99.0';
const minNodeVersion = '18.0.0';
const jsiiVersion = '~5.7.0';
const constructsVersion = '10.4.2';
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
  projenDevDependency: false,
  defaultReleaseBranch: 'main',
  minNodeVersion: minNodeVersion,
  jsiiVersion: jsiiVersion,
  name: '@jjrawlins/cdk-git-tagger',
  npmAccess: NpmAccess.PUBLIC,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/jjrawlins/cdk-git-tagger.git',
  githubOptions: {
    mergify: false,
    pullRequestLint: false,
  },
  depsUpgrade: false,
  publishToPypi: {
    distName: 'jjrawlins.cdk-git-tagger',
    module: 'jjrawlins.cdk_git_tagger',
  },
  publishToGo: {
    moduleName: 'github.com/jjrawlins/cdk-git-tagger',
  },
  deps: [
    'projen',
    'mock-fs',
    `aws-cdk-lib@${cdkVersion}`,
    `constructs@${constructsVersion}`,
  ],
  devDeps: [
    '@types/mock-fs',
    `aws-cdk@${cdkVersion}`, // aws-cdk CLI should be a dev dependency
  ],
  peerDeps: [
    `aws-cdk-lib@^${cdkVersion}`,
    `constructs@${constructsVersion}`,
  ],
  bundledDeps: [
    'mock-fs',
  ],
  eslint: true,
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
    },
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


project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');
project.synth();
