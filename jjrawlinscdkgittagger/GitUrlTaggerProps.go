package jjrawlinscdkgittagger


type GitUrlTaggerProps struct {
	// A flag on whether to try to normalize the URL found in the git config If enabled, it will turn ssh urls into https urls.
	// Default: true.
	//
	NormalizeUrl *bool `field:"optional" json:"normalizeUrl" yaml:"normalizeUrl"`
	// The Tag key/name to use.
	// Default: 'GitUrl'.
	//
	TagName *string `field:"optional" json:"tagName" yaml:"tagName"`
}

