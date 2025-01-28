import { awscdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const cdkVersion = '2.150.0';
const minNodeVersion = '20.9.0';
const jsiiVersion = '~5.4.0';
const constructsVersion = '10.3.2';
const projenVersion = '0.91.6';
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
  npmAccess: NpmAccess.PUBLIC,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/jjrawlins/cdk-git-tagger.git',
  githubOptions: {
    mergify: false,
    pullRequestLint: false,
  },
  depsUpgrade: false,
  publishToPypi: {
    distName: 'jjrawlins_cdk-git-tagger',
    module: 'jjrawlins_cdk_git_tagger',
  },
  publishToGo: {
    moduleName: 'github.com/jjrawlins/cdk-git-tagger',
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

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');

// Projen creates this incorrectly
// Removing to keep linter happy
project.compileTask.exec('rm -r tsconfig.json');

project.package.addField('resolutions', {
  constructs: '10.3.2',
});

project.synth();
