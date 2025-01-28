import * as os from 'os';
import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import * as fs from 'fs-extra';
import { glob } from 'glob';


export function mkdtemp(dirPrefix: string) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${dirPrefix}-`));
}

export interface SynthOutput {
  [filePath: string]: any;
}

export interface DirectorySnapshotOptions {
  /**
   * Globs of files to exclude.
   * @default [] include all files
   */
  readonly excludeGlobs?: string[];
}

export function directorySnapshot(root: string, options: DirectorySnapshotOptions = {}) {
  const output: SynthOutput = {};

  const files = glob.sync('**', {
    ignore: options.excludeGlobs ?? [],
    cwd: root,
    nodir: true,
    dot: true,
  }); // returns relative file paths with POSIX separators

  for (const file of files) {
    const filePath = path.join(root, file);

    let content: any;
    if (path.extname(filePath) === '.json') {
      try {
        content = fs.readJsonSync(filePath);
      } catch (e) {
        content = fs.readFileSync(filePath, 'utf-8');
      }
    } else {
      content = fs.readFileSync(filePath, 'utf-8');
    }

    output[file] = content;
  }

  return output;
}

export function synthSnapshot(stack: Stack): any {
  const app = stack.node.root as App; // Cast to App type to access outdir
  if (!path.resolve(app.outdir).startsWith(os.tmpdir())) {
    throw new Error('Trying to capture a snapshot of a stack outside of tmpdir');
  }

  try {
    app.synth();
    const ignoreExts = ['png', 'ico'];
    return directorySnapshot(app.outdir, {
      excludeGlobs: ignoreExts.map(ext => `**/*.${ext}`),
    });
  } finally {
    fs.removeSync(app.outdir);
  }
}


