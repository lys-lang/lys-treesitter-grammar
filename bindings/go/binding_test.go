package tree_sitter_lys_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lys "github.com/lys-lang/tree-sitter-lys/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lys.Language())
	if language == nil {
		t.Errorf("Error loading Lys grammar")
	}
}
