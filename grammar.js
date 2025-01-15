/**
 * @file ⚜︎ A language that compiles to WebAssembly
 * @author Michał Schwarz <mschwarz@blckcomp.com>
 * @license BSD-3-Clause
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: "lys",

    rules: {
        document: $ => $.directives,

        directives: $ => repeat1($.directive),
        directive: $ => choice(
            // $.function_directive,
            $.val_directive,
            $.var_directive,
            // $.struct_directive,
            // $.type_directive,
            // $.enum_directive,
            // $.trait_directive,
            $.import_directive,
            // $.effect_directive,
            // token($.impl_directive),
        ),

        // function_directive: $ => null,
        val_directive: $ => seq(optional($.private_modifier), $.val_declaration),
        var_directive: $ => seq(optional($.private_modifier), $.var_declaration),
        // struct_directive: $ => null,
        // type_directive: $ => null,
        // enum_directive: $ => null,
        // trait_directive: $ => null,
        import_directive: $ => seq(
            alias($.IMPORT_KEYWORD, 'import'), $.qname, optional(seq('as', $.name_identifier)),
        ),
        // effect_directive: $ => null,
        // impl_directive: $ => null,

        // impl_inner_directive: $ => choice(
        //     $.function_directive,
        //     $.val_directive,
        //     token($.var_directive),
        // ),

        private_modifier: $ => alias($.PRIVATE_KEYWORD, 'private'),

        val_declaration: $ => seq(alias($.VAL_KEYWORD, 'val'), $.name_identifier, optional($.of_type), $.assign),
        var_declaration: $ => seq(alias($.VAR_KEYWORD, 'var'), $.name_identifier, optional($.of_type), $.assign),

        unknown_expression: _ => '???',

        assign:  $ => seq('=', choice($.expression, $.unknown_expression)),
        of_type: $ => seq(alias($.COLON, ':'), optional($.function_effect), $.type),

        function_effect: $ => seq('<', optional($.type), '>'),

        type:              $ => $.union_type,
        union_type:        $ => seq($.intersection_type, repeat(seq('|', $.intersection_type))),
        intersection_type: $ => seq($.atom_type, repeat(seq('&', $.atom_type))),
        atom_type:         $ => choice($.type_paren, $.function_type_literal, $.reference),
        type_paren:        $ => seq(alias($.OPEN_PAREN, '('), $.type, alias($.CLOSE_PAREN, ')')),

        function_type_literal: _ => 'func type literal',

        expression: _ => 'expr',

        reference: $ => $.qname,

        name_identifier: _ => /\$?[A-Za-z_][A-Za-z0-9_$]*/,
        qname: $ => seq($.name_identifier, repeat(seq(token.immediate('::'), $.name_identifier))),

        /* ------------------------------ Nonterminals ------------------------------ */

        KEYWORD: $ => token(choice(
            $.TRUE_KEYWORD,
            $.FALSE_KEYWORD,
            $.IF_KEYWORD,
            $.ELSE_KEYWORD,
            $.CASE_KEYWORD,
            $.VAR_KEYWORD,
            $.VAL_KEYWORD,
            $.TYPE_KEYWORD,
            $.ENUM_KEYWORD,
            $.TRAIT_KEYWORD,
            $.EFFECT_KEYWORD,
            $.IMPL_KEYWORD,
            $.FOR_KEYWORD,
            $.IMPORT_KEYWORD,
            $.FUN_KEYWORD,
            $.STRUCT_KEYWORD,
            $.PRIVATE_KEYWORD,
            $.MATCH_KEYWORD,
            $.LOOP_KEYWORD,
            $.CONTINUE_KEYWORD,
            $.BREAK_KEYWORD,
            $.RESERVED_WORDS,
        )),

        WASM_KEYWORD:             _ => '%wasm',		// {pin=1}
        STRUCT_LITERAL_KEYWORD:   _ => '%struct',	// {pin=1}
        STACK_LITERAL_KEYWORD:    _ => '%stack',	// {pin=1}
        INJECTED_LITERAL_KEYWORD: _ => '%injected',	// {pin=1}

        FUN_KEYWORD:     _ => 'fun',
        VAL_KEYWORD:     _ => 'val',
        VAR_KEYWORD:     _ => 'var',
        EFFECT_KEYWORD:  _ => 'effect',
        IMPL_KEYWORD:    _ => 'impl',
        FOR_KEYWORD:     _ => 'for',
        IMPORT_KEYWORD:  _ => 'import',
        STRUCT_KEYWORD:  _ => 'struct',
        PRIVATE_KEYWORD: _ => 'private',
        TYPE_KEYWORD:    _ => 'type',
        ENUM_KEYWORD:    _ => 'enum',
        TRAIT_KEYWORD:   _ => 'trait',
        CASE_KEYWORD:    _ => 'case',

        LOOP_KEYWORD:     _ => 'loop',		// ![A-Za-z0-9_$]
        CONTINUE_KEYWORD: _ => 'continue',	// ![a-zA-Z0-9_$]
        BREAK_KEYWORD:    _ => 'break',		// ![A-Za-z0-9_$]
        TRUE_KEYWORD:     _ => 'true',		// ![A-Za-z0-9_$]
        FALSE_KEYWORD:    _ => 'false',		// ![A-Za-z0-9_$]
        IF_KEYWORD:       _ => 'if',		// ![A-Za-z0-9_$]
        ELSE_KEYWORD:     _ => 'else',		// ![A-Za-z0-9_$]
        MATCH_KEYWORD:    _ => 'match',		// ![A-Za-z0-9_$]

        RESERVED_WORDS: _ => token(choice(
            'abstract',
            'async',
            'await',
            'class',
            'const',
            'declare',
            'defer',
            'delete',
            'do',
            'extends',
            'finally',
            'for',
            'import',
            'is',
            'in',
            'let',
            'new',
            'package',
            'protected',
            'public',
            'try',
            'using',
            'while',
            'yield',
        )),

        // NEXT_ARG_RECOVERY: $ => &(',' | ')')
        // PAREN_RECOVERY: $ => &(')'),
        // BRACKET_RECOVERY: $ => &('}'),
        // MATCH_RECOVERY: $ => &('}' | 'case' | 'else'),
        // BLOCK_RECOVERY: $ => &('}' | NEW_LINE),
        OPEN_PAREN:        _ => '(',
        CLOSE_PAREN:       _ => ')',
        OPEN_ARRAY:        _ => '[',
        OPEN_DECORATION:   _ => '#[',		// {pin=1}
        CLOSE_ARRAY:       _ => ']',		// {pin=1}
        STRING_DELIMITER:  _ => '"',		// {pin=1}
        OPEN_BRACKET:      _ => '{',
        CLOSE_BRACKET:     _ => '}',
        THIN_ARROW:        _ => '->',
        COLON:             _ => ':',
        OPEN_DOC_COMMENT:  _ => '/*',
        CLOSE_DOC_COMMENT: _ => '*/',
    },

    inline: $ => [
        $.directives, $.directive,

        $.assign, $.of_type,
        $.union_type, $.intersection_type, $.atom_type, $.type_paren,

        // $.qname,

        // $.WASM_KEYWORD,
        // $.STRUCT_LITERAL_KEYWORD, $.STACK_LITERAL_KEYWORD,
        // $.INJECTED_LITERAL_KEYWORD,

        // $.FUN_KEYWORD, $.VAL_KEYWORD, $.VAR_KEYWORD, $.EFFECT_KEYWORD, $.IMPL_KEYWORD,
        // $.FOR_KEYWORD, $.IMPORT_KEYWORD, $.STRUCT_KEYWORD, $.PRIVATE_KEYWORD, $.TYPE_KEYWORD,
        // $.ENUM_KEYWORD, $.TRAIT_KEYWORD, $.CASE_KEYWORD,

        // $.LOOP_KEYWORD, $.CONTINUE_KEYWORD, $.BREAK_KEYWORD, $.TRUE_KEYWORD, $.FALSE_KEYWORD,
        // $.IF_KEYWORD, $.ELSE_KEYWORD, $.MATCH_KEYWORD,

    ],
});

// vim:ts=8 sw=4 et
