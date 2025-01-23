import { App, Aspects, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import mock = require('mock-fs');
import { GitUrlTagger, GitUrlTaggerProps } from '../src';


function setupTestStack(props?: Partial<GitUrlTaggerProps>, url: string = 'https://something') {
  mock({
    '.git/config': 'url = ' + url,
  });

  const app = new App();
  const stack = new Stack(app, 'MyStack');
  new Topic(stack, 'MyTopic', {});

  Aspects.of(stack).add(new GitUrlTagger(props));
  return stack;
}
afterEach(() => {
  mock.restore();
});

describe('Aspect adds tags as expected', () => {
  test('with defaults', () => {
    const stack = setupTestStack();

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'https://something',
      }],
    });
  });

  test('with overridden tag name', () => {
    const stack = setupTestStack({ tagName: 'MyTagName' });

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: 'https://something',
      }],
    });
  });

  test('normalizes by default', ()=>{
    const stack = setupTestStack({ tagName: 'MyTagName' }, 'git@github.com:jjrawlins/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: 'https://github.com/jjrawlins/cdk-git-tagger',
      }],
    });
  });
});

describe('URLs are normalized', function () {

  test('to https when asked', () => {
    const stack = setupTestStack({ normalizeUrl: true }, 'git@github.com:jjrawlins/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'https://github.com/jjrawlins/cdk-git-tagger',
      }],
    });
  });

  test('doesn\'t change when already https', () => {
    const stack = setupTestStack({ normalizeUrl: false }, 'git@github.com:jjrawlins/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'git@github.com:jjrawlins/cdk-git-tagger.git',
      }],
    });
  });
});
