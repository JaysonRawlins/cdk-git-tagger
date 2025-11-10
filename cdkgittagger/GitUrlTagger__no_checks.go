//go:build no_runtime_type_checking

package cdkgittagger

// Building without runtime type checking enabled, so all the below just return nil

func (g *jsiiProxy_GitUrlTagger) validatePutGitUrlInFileParameters(gitUrl *string) error {
	return nil
}

func (g *jsiiProxy_GitUrlTagger) validateVisitParameters(node constructs.IConstruct) error {
	return nil
}

func validateNewGitUrlTaggerParameters(props *GitUrlTaggerProps) error {
	return nil
}

