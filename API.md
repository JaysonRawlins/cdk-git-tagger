# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### GitUrlTaggerProps <a name="GitUrlTaggerProps" id="@jjrawlins/cdk-git-tagger.GitUrlTaggerProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-git-tagger.GitUrlTaggerProps.Initializer"></a>

```typescript
import { GitUrlTaggerProps } from '@jjrawlins/cdk-git-tagger'

const gitUrlTaggerProps: GitUrlTaggerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTaggerProps.property.normalizeUrl">normalizeUrl</a></code> | <code>boolean</code> | A flag on whether to try to normalize the URL found in the git config If enabled, it will turn ssh urls into https urls. |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTaggerProps.property.tagName">tagName</a></code> | <code>string</code> | The Tag key/name to use. |

---

##### `normalizeUrl`<sup>Optional</sup> <a name="normalizeUrl" id="@jjrawlins/cdk-git-tagger.GitUrlTaggerProps.property.normalizeUrl"></a>

```typescript
public readonly normalizeUrl: boolean;
```

- *Type:* boolean
- *Default:* true

A flag on whether to try to normalize the URL found in the git config If enabled, it will turn ssh urls into https urls.

---

##### `tagName`<sup>Optional</sup> <a name="tagName" id="@jjrawlins/cdk-git-tagger.GitUrlTaggerProps.property.tagName"></a>

```typescript
public readonly tagName: string;
```

- *Type:* string
- *Default:* 'GitUrl'

The Tag key/name to use.

---

## Classes <a name="Classes" id="Classes"></a>

### GitUrlTagger <a name="GitUrlTagger" id="@jjrawlins/cdk-git-tagger.GitUrlTagger"></a>

- *Implements:* aws-cdk-lib.IAspect

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.Initializer"></a>

```typescript
import { GitUrlTagger } from '@jjrawlins/cdk-git-tagger'

new GitUrlTagger(props?: GitUrlTaggerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTagger.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTaggerProps">GitUrlTaggerProps</a></code> | *No description.* |

---

##### `props`<sup>Optional</sup> <a name="props" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-git-tagger.GitUrlTaggerProps">GitUrlTaggerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTagger.findGitDirectory">findGitDirectory</a></code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTagger.putGitUrlInFile">putGitUrlInFile</a></code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTagger.retrieveGitUrl">retrieveGitUrl</a></code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-git-tagger.GitUrlTagger.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `findGitDirectory` <a name="findGitDirectory" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.findGitDirectory"></a>

```typescript
public findGitDirectory(): string
```

##### `putGitUrlInFile` <a name="putGitUrlInFile" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.putGitUrlInFile"></a>

```typescript
public putGitUrlInFile(gitUrl: string): void
```

###### `gitUrl`<sup>Required</sup> <a name="gitUrl" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.putGitUrlInFile.parameter.gitUrl"></a>

- *Type:* string

---

##### `retrieveGitUrl` <a name="retrieveGitUrl" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.retrieveGitUrl"></a>

```typescript
public retrieveGitUrl(): string
```

##### `visit` <a name="visit" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.visit"></a>

```typescript
public visit(construct: IConstruct): void
```

All aspects can visit an IConstruct.

###### `construct`<sup>Required</sup> <a name="construct" id="@jjrawlins/cdk-git-tagger.GitUrlTagger.visit.parameter.construct"></a>

- *Type:* constructs.IConstruct

---





