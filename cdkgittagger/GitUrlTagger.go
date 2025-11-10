package cdkgittagger

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-git-tagger/cdkgittagger/jsii"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/JaysonRawlins/cdk-git-tagger/cdkgittagger/internal"
)

type GitUrlTagger interface {
	awscdk.IAspect
	FindGitDirectory() *string
	PutGitUrlInFile(gitUrl *string)
	RetrieveGitUrl() *string
	// All aspects can visit an IConstruct.
	Visit(node constructs.IConstruct)
}

// The jsii proxy struct for GitUrlTagger
type jsiiProxy_GitUrlTagger struct {
	internal.Type__awscdkIAspect
}

func NewGitUrlTagger(props *GitUrlTaggerProps) GitUrlTagger {
	_init_.Initialize()

	if err := validateNewGitUrlTaggerParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_GitUrlTagger{}

	_jsii_.Create(
		"@jjrawlins/cdk-git-tagger.GitUrlTagger",
		[]interface{}{props},
		&j,
	)

	return &j
}

func NewGitUrlTagger_Override(g GitUrlTagger, props *GitUrlTaggerProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-git-tagger.GitUrlTagger",
		[]interface{}{props},
		g,
	)
}

func (g *jsiiProxy_GitUrlTagger) FindGitDirectory() *string {
	var returns *string

	_jsii_.Invoke(
		g,
		"findGitDirectory",
		nil, // no parameters
		&returns,
	)

	return returns
}

func (g *jsiiProxy_GitUrlTagger) PutGitUrlInFile(gitUrl *string) {
	if err := g.validatePutGitUrlInFileParameters(gitUrl); err != nil {
		panic(err)
	}
	_jsii_.InvokeVoid(
		g,
		"putGitUrlInFile",
		[]interface{}{gitUrl},
	)
}

func (g *jsiiProxy_GitUrlTagger) RetrieveGitUrl() *string {
	var returns *string

	_jsii_.Invoke(
		g,
		"retrieveGitUrl",
		nil, // no parameters
		&returns,
	)

	return returns
}

func (g *jsiiProxy_GitUrlTagger) Visit(node constructs.IConstruct) {
	if err := g.validateVisitParameters(node); err != nil {
		panic(err)
	}
	_jsii_.InvokeVoid(
		g,
		"visit",
		[]interface{}{node},
	)
}

