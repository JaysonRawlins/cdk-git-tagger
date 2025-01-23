//go:build !no_runtime_type_checking

package jjrawlinscdkgittagger

import (
	"fmt"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"

	"github.com/aws/constructs-go/constructs/v10"
)

func (g *jsiiProxy_GitUrlTagger) validatePutGitUrlInFileParameters(gitUrl *string) error {
	if gitUrl == nil {
		return fmt.Errorf("parameter gitUrl is required, but nil was provided")
	}

	return nil
}

func (g *jsiiProxy_GitUrlTagger) validateVisitParameters(construct constructs.IConstruct) error {
	if construct == nil {
		return fmt.Errorf("parameter construct is required, but nil was provided")
	}

	return nil
}

func validateNewGitUrlTaggerParameters(props *GitUrlTaggerProps) error {
	if err := _jsii_.ValidateStruct(props, func() string { return "parameter props" }); err != nil {
		return err
	}

	return nil
}

