// CDK Aspect to tag resources with git metadata.  This provides a nice connection between the construct and the git repository.
package cdk-git-tagger

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-git-tagger.GitUrlTagger",
		reflect.TypeOf((*GitUrlTagger)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "findGitDirectory", GoMethod: "FindGitDirectory"},
			_jsii_.MemberMethod{JsiiMethod: "putGitUrlInFile", GoMethod: "PutGitUrlInFile"},
			_jsii_.MemberMethod{JsiiMethod: "retrieveGitUrl", GoMethod: "RetrieveGitUrl"},
			_jsii_.MemberMethod{JsiiMethod: "visit", GoMethod: "Visit"},
		},
		func() interface{} {
			j := jsiiProxy_GitUrlTagger{}
			_jsii_.InitJsiiProxy(&j.Type__awscdkIAspect)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-git-tagger.GitUrlTaggerProps",
		reflect.TypeOf((*GitUrlTaggerProps)(nil)).Elem(),
	)
}
