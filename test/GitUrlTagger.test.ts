import * as path from 'path';
import { App, Aspects, Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import * as fs from 'fs-extra';
import { mkdtemp, synthSnapshot } from './TestUtils';
import { GitUrlTagger } from '../src';


describe('Aspect adds tags as expected', () => {
  let app: App;
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtemp('git-tagger');
    process.env.UNIT_TEST_ROOT_DIR = tempDir;

    fs.writeJSONSync(path.join(tempDir, 'package.json'), {
      name: 'test-project',
      version: '1.0.0',
    });

    const gitDir = path.join(tempDir, '.git');
    fs.mkdirSync(gitDir);
    fs.writeFileSync(path.join(gitDir, 'config'), `
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[remote "origin"]
        url = git@github.com:jjrawlins/cdk-git-tagger.git
        fetch = +refs/heads/*:refs/remotes/origin/*
    `);

    app = new App({
      outdir: tempDir,
    });
  });

  afterEach(() => {
    fs.removeSync(tempDir);
  });

  test('with defaults', () => {
    const stack = new Stack(app, 'AspectTestTags');
    new Topic(stack, 'MyTopic');

    Aspects.of(app).add(new GitUrlTagger({}));
    const snapshot = synthSnapshot(stack);
    expect(snapshot['.git-url-tagger.json']).toBeDefined();
    const template = snapshot['AspectTestTags.template.json'];
    interface CfnResource {
      Type: string;
      Properties: {
        Tags?: Array<{ Key: string; Value: string }>;
      };
    }
    const myTopic = Object.values(template.Resources)
      .find((resource): resource is CfnResource => {
        const resourceObject = resource as any;
        return resourceObject !== null &&
              typeof resourceObject === 'object' &&
              'Type' in resourceObject &&
              resourceObject.Type === 'AWS::SNS::Topic';
      });

    expect(myTopic?.Properties.Tags).toEqual([
      {
        Key: 'GitUrl',
        Value: 'https://github.com/jjrawlins/cdk-git-tagger',
      },
    ]);

    expect(snapshot).toMatchSnapshot();

  });

  test('with overridden tag name', () => {
    const stack = new Stack(app, 'OverrideTagName');
    new Topic(stack, 'MyTopic');

    Aspects.of(app).add(new GitUrlTagger({
      normalizeUrl: true,
      tagName: 'MyTagName',
    }));

    const snapshot = synthSnapshot(stack);
    expect(snapshot['.git-url-tagger.json']).toBeDefined();
    const template = snapshot['OverrideTagName.template.json'];
    interface CfnResource {
      Type: string;
      Properties: {
        Tags?: Array<{ Key: string; Value: string }>;
      };
    }
    const myTopic = Object.values(template.Resources)
      .find((resource): resource is CfnResource => {
        const resourceObject = resource as any;
        return resourceObject !== null &&
              typeof resourceObject === 'object' &&
              'Type' in resourceObject &&
              resourceObject.Type === 'AWS::SNS::Topic';
      });


    expect(myTopic?.Properties.Tags).toEqual([
      {
        Key: 'MyTagName',
        Value: 'https://github.com/jjrawlins/cdk-git-tagger',
      },
    ]);

    expect(snapshot).toMatchSnapshot();
  });

  test('normalizes by default', ()=>{
    const stack = new Stack(app, 'Normalize');
    new Topic(stack, 'MyTopic');
    Aspects.of(app).add(new GitUrlTagger({
      tagName: 'MyTagName',
    }));

    const snapshot = synthSnapshot(stack);
    expect(snapshot['.git-url-tagger.json']).toBeDefined();
    const template = snapshot['Normalize.template.json'];
    interface CfnResource {
      Type: string;
      Properties: {
        Tags?: Array<{ Key: string; Value: string }>;
      };
    }
    const myTopic = Object.values(template.Resources)
      .find((resource): resource is CfnResource => {
        const resourceObject = resource as any;
        return resourceObject !== null &&
              typeof resourceObject === 'object' &&
              'Type' in resourceObject &&
              resourceObject.Type === 'AWS::SNS::Topic';
      });


    expect(myTopic?.Properties.Tags).toEqual([
      {
        Key: 'MyTagName',
        Value: 'https://github.com/jjrawlins/cdk-git-tagger',
      },
    ]);

    expect(snapshot).toMatchSnapshot();

  });
});


