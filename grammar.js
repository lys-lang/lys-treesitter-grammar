/**
 * @file ⚜︎ A language that compiles to WebAssembly
 * @author Michał Schwarz <mschwarz@blckcomp.com>
 * @license BSD-3-Clause
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: "lys",

    // conflicts: $ => [],

    word: $ => $.word,

    rules: {
        document: $ => $._directives,

        _directives: $ => repeat1($.directive),
        directive: $ => choice(
            prec(10, $._val_directive),
            prec(10, $._var_directive),
            prec( 9, $._type_directive),
            prec( 8, $._function_directive),
            prec( 7, $._struct_directive),
            prec( 6, $._enum_directive),
            prec( 5, $._trait_directive),
            prec( 4, $._effect_directive),
            prec( 3, $._impl_directive),
            prec( 2, $._import_directive),
        ),

        _function_directive: $ => seq(optional($._decorators), optional($.private_modifier), $.fun_declaration),
        _val_directive:      $ => seq(optional($.private_modifier), $.val_declaration),
        _var_directive:      $ => seq(optional($.private_modifier), $.var_declaration),
        _struct_directive:   $ => seq(optional($.private_modifier), $.struct_declaration),
        _type_directive:     $ => seq(optional($.private_modifier), $.type_declaration),
        _enum_directive:     $ => seq(optional($.private_modifier), $.enum_declaration),
        _trait_directive:    $ => seq(optional($.private_modifier), $.trait_declaration),
        _import_directive:   $ => seq($.import_declaration),
        _effect_directive:   $ => seq(optional($.private_modifier), $.effect_declaration),
        _impl_directive:     $ => seq(optional($.private_modifier), $.impl_block),

        _impl_inner_directive: $ => choice(
            $._function_directive,
            $._val_directive,
            $._var_directive,
        ),

        _decorators: $ => repeat1($.decorator),
        decorator: $ => seq(
            alias($.OPEN_DECORATION, '#['),
            $.name_identifier, repeat('___decorator->lit___'),
            alias($.CLOSE_ARRAY, ']'),
        ),

        private_modifier: $ => field("vis", alias($.PRIVATE_KEYWORD, 'private')),

        fun_declaration: $ => seq(
            alias($.FUN_KEYWORD, 'fun'), field("name", $._function_name),
            optional($._type_variables), $._function_signature_params,
            prec(100, optional(field("return_type", $.of_type))),
            optional($._fun_assign_expression),
        ),
        val_declaration: $ => seq(
            alias($.VAL_KEYWORD, 'val'), field("name", $.name_identifier),
            optional(field("type", $.of_type)), $._assign,
        ),
        var_declaration: $ => seq(
            alias($.VAR_KEYWORD, 'var'), field("name", $.name_identifier),
            optional(field("type", $.of_type)), $._assign,
        ),
        struct_declaration: $ => seq(
            alias($.STRUCT_KEYWORD, 'struct'),
            field("typename", $.name_identifier),
            $._struct_members_decl,
        ),
        type_declaration: $ => seq(
            alias($.TYPE_KEYWORD, 'type'),
            field("typename", $.name_identifier),
            prec.right($._type_assign),
        ),
        enum_declaration: $ => seq(
            alias($.ENUM_KEYWORD, 'enum'),
            field("name", $.name_identifier),
            $._enum_variants_decl,
        ),
        trait_declaration: $ => seq(
            alias($.TRAIT_KEYWORD, 'trait'),
            field("name", $.name_identifier),
        ),
        import_declaration: $ => seq(
            alias($.IMPORT_KEYWORD, 'import'),
            field("path", $.qname),
            optional($._import_alias),
        ),
        effect_declaration: $ => seq(
            alias($.EFFECT_KEYWORD, 'effect'),
        ),
        impl_block: $ => seq(
            alias($.IMPL_KEYWORD, 'impl'),
            choice(
                field("selftype", alias($.namedtype, $.selftype)),
                seq(
                    field("impltype", alias($.namedtype, $.impltype)),
                    alias($.FOR_KEYWORD, 'for'),
                    field("selftype", alias($.namedtype, $.selftype)),
                ),
            ),
        ),

        _import_alias: $ => seq(alias($.AS_KEYWORD, 'as'), field("alias", $.name_identifier)),

        value_type:         $ => seq('=', $._type_assign),
        unknown_expression: _ => '???',
        wasm_expression:    _ => '___wasm expression___',

        struct_literal: $ => seq(
            alias($.STRUCT_LITERAL_KEYWORD, '%struct'),
            alias($.OPEN_BRACKET, '{'),
            optional($._typed_names_list),
            alias($.CLOSE_BRACKET, '}'),
        ),
        stack_literal: $ => seq(
            alias($.STACK_LITERAL_KEYWORD, '%stack'), optional($._stack_namepair_list),
        ),
        injected_literal: $ => (
            alias($.INJECTED_LITERAL_KEYWORD, '%injected')
        ),

        typevar: _ => /[A-Z][A-Za-z0-9_]*/,
        _type_variables: $ => seq(
            alias($.OPEN_TYPEVARS, '<'),
            field("typevars", repeat($._typevars_list_item)),
            alias($.CLOSE_TYPEVARS, '>'),
        ),
        _typevars_list_item: $ => seq($.typevar, optional(',')),

        of_type: $ => seq(alias($.COLON, ':'), optional($.function_effect), $._type),

        _assign: $ => seq(alias($.ASSIGN_OP, '='),
            field("expr",
                choice(
                    $._expression,
                    $.unknown_expression,
                ),
            )),
        _type_assign: $ => seq(alias($.ASSIGN_OP, '='),
            field("type",
                choice(
                    $._type,
                    $.struct_literal,
                    $.stack_literal,
                    $.injected_literal,
                )),
            ),
        _fun_assign_expression: $ => seq(alias($.ASSIGN_OP, '='),
            field("expr",
                choice(
                    $._expression,
                    $.wasm_expression,
                    $.unknown_expression,
                ),
            )),

        _struct_members_decl: $ => seq(
            alias($.OPEN_PAREN, '('),
            optional(field("members", $._typed_names_list)),
            alias($.CLOSE_PAREN, ')'),
        ),
        _enum_variants_decl: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            optional(field("variants", $._typed_names_list)),
            alias($.CLOSE_BRACKET, '}'),
        ),
        _stack_namepair_list: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            optional($._stack_namepairs),
            alias($.CLOSE_BRACKET, '}'),
        ),
        _function_signature_params: $ => seq(
            alias($.OPEN_PAREN, '('),
            optional(field("signature", $._typed_names_list)),
            alias($.CLOSE_PAREN, ')'),
        ),

        _stack_namepairs: $ => repeat1($.name_literal_pair),

        _typed_names_list: $ => repeat1(seq($.typed_name, optional(','))),
        typed_name:        $ => seq(field("name", $.name_identifier), optional(field("type", $.of_type))),

        _function_name: $ => choice($.name_identifier, $._fun_operator),
        _fun_operator:  $ => choice(
            $.B_NOT_PRE_OP, $.UNARY_MINUS_OP,
            $.AS_KEYWORD, $.IS_KEYWORD,
            $.MUL_OP, $.ADD_OP, $.SHIFT_OP, $.REL_OP, $.EQ_OP,
            $.B_AND_OP, $.B_XOR_OP, $.B_OR_OP,
            $.LOGIC_AND_OP, $.LOGIC_OR_OP, $.LOGIC_NOT_OP,
            '[]',
        ),

        function_effect: $ => seq(
            alias($.OPEN_TYPEVARS, '<'),
            optional($._type),
            alias($.CLOSE_TYPEVARS, '>'),
        ),

        _type: $ => choice(
            $.sumtype,
            $.uniontype,
            $._grouped_type,
            prec(2, $.namedtype),
            prec(1, $.functiontype),
        ),
        sumtype: $ => prec.left(5,
            seq($._type, alias($.B_OR_OP, '|'), $._type),
        ),
        uniontype: $ => prec.left(4,
            seq($._type, alias($.B_AND_OP, '&'), $._type),
        ),
        _grouped_type: $ => prec.left(3,
            seq(alias($.OPEN_PAREN, '('), $._type, alias($.CLOSE_PAREN, ')')),
        ),
        union_type: $ => prec.left(
            seq($.intersect_type, repeat(seq(alias($.B_OR_OP, '|'), $.intersect_type))),
        ),
        intersect_type: $ => prec.left(
            seq($._atom_type, repeat(seq(alias($.B_AND_OP, '&'), $._atom_type))),
        ),
        _atom_type:     $ => choice($._type_paren, $.functiontype, $.namedtype),
        _type_paren:    $ => seq(alias($.OPEN_PAREN, '('), $._type, alias($.CLOSE_PAREN, ')')),

        // XXX: chuck this in the bin if we can do without the `prec.right(...)`
        //_atom_type:     $ => choice($._type_paren, prec.right(100, $.functiontype), $.namedtype),

        functiontype: $ => seq(
            alias($.FUN_KEYWORD, 'fun'), optional($._type_variables),
            field("params", $._funtype_sig_params_list),
            alias($.THIN_ARROW, '->'),
            field("return_type", $._type),
        ),
        _funtype_sig_params_list: $ => seq(
            alias($.OPEN_PAREN, '('), repeat($.funtype_sig_param), alias($.CLOSE_PAREN, ')'),
        ),
        funtype_sig_param: $ => seq(
            optional($.function_param_name), field("param_type", $._type), optional(','),
        ),
        function_param_name: $ => seq(field("param_name", $.name_identifier), alias($.COLON, ':')),

        _expression: _ => 'expr',

        namedtype: $ => prec.left($.qname),

        literal: _ => '___literal___',

        name_identifier: _ => /\$?[A-Za-z_][A-Za-z0-9_$]*/,
        qname: $ => choice(
            // $._namespaced_qname,
            prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),
            prec(2, $.name_identifier),
        ),

        _namespaced_qname: $ => prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),

        // qname: $ => seq($.name_identifier, repeat(seq(alias($.NAMESPACE_SEP, '::'), $.name_identifier))),
        // qname: $ => seq($.name_identifier, prec.left(repeat(seq(alias($.NAMESPACE_SEP, '::'), $.name_identifier)))),

        name_literal_pair: $ => seq(
            field("name", $.name_identifier),
            alias($.ASSIGN_OP, '='),
            field("value", $.literal),
        ),

        /* -------------------------------------------------------------------------------------- */
        /* ------------------------------------ Nonterminals ------------------------------------ */
        /* -------------------------------------------------------------------------------------- */

        WASM_KEYWORD:             _ => '%wasm',
        STRUCT_LITERAL_KEYWORD:   _ => '%struct',
        STACK_LITERAL_KEYWORD:    _ => '%stack',
        INJECTED_LITERAL_KEYWORD: _ => '%injected',

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

        LOOP_KEYWORD:     _ => 'loop',
        CONTINUE_KEYWORD: _ => 'continue',
        BREAK_KEYWORD:    _ => 'break',
        TRUE_KEYWORD:     _ => 'true',
        FALSE_KEYWORD:    _ => 'false',
        IF_KEYWORD:       _ => 'if',
        ELSE_KEYWORD:     _ => 'else',
        MATCH_KEYWORD:    _ => 'match',

        RESERVED_WORDS: _ => token(choice(
            'async', 'await', 'yield',
            'class', 'extends', 'abstract', 'protected', 'public',
            'type', 'enum', 'struct', 'trait', 'effect', 'impl',
            'const', 'declare', 'let', 'val', 'var',
            'fun', 'defer',
            'new', 'delete',
            'try', 'finally',
            'if', 'else', 'case', 'match',
            'for', 'do', 'while', 'loop', 'continue', 'break',
            'package', 'import', 'using', 'private',
            'is', 'in',
            'true', 'false',
        )),

        KEYWORD: $ => token(choice(
            $.RESERVED_WORDS,
            $.STRUCT_LITERAL_KEYWORD,
            $.WASM_KEYWORD, $.STACK_LITERAL_KEYWORD, $.INJECTED_LITERAL_KEYWORD,
        )),

        /* -------------------------------------------------------------------------------------- */
        /* ---------------------------------- Operator Tokens ----------------------------------- */
        /* -------------------------------------------------------------------------------------- */

        // Precedence in accordance [with Java](https://introcs.cs.princeton.edu/java/11precedence)
        LOGIC_NOT_OP:   _ => prec(14, '!'),
        B_NOT_PRE_OP:   _ => prec(14, '~'),
        UNARY_MINUS_OP: _ => prec(14, '-'),
        AS_KEYWORD:     _ => prec(13, 'as'),
        IS_KEYWORD:     _ => prec(13, 'is'),
        MUL_OP:         _ => prec(12, token(choice('**', '*', '/', '%'))),
        ADD_OP:         _ => prec(11, token(choice('++', '+', '-'))),
        SHIFT_OP:       _ => prec(10, token(choice('>>>', '>>', '<<'))),
        REL_OP:         _ => prec( 9, token(choice('>=', '<=', '>', '<'))),
        EQ_OP:          _ => prec( 8, token(choice('===', '!==', '~=', '==', '!='))),
        B_AND_OP:       _ => prec( 7, '&'),
        B_XOR_OP:       _ => prec( 6, '^'),
        B_OR_OP:        _ => prec( 5, '|'),
        LOGIC_AND_OP:   _ => prec( 4, '&&'),
        LOGIC_OR_OP:    _ => prec( 3, '||'),
        ASSIGN_OP:      _ => prec( 1, '='),

        /* -------------------------------------------------------------------------------------- */
        /* ------------------------------------- Punctuation ------------------------------------ */
        /* -------------------------------------------------------------------------------------- */
        OPEN_PAREN:        _ => '(',
        CLOSE_PAREN:       _ => ')',
        OPEN_ARRAY:        _ => '[',
        OPEN_DECORATION:   _ => '#[',
        CLOSE_ARRAY:       _ => ']',
        STRING_DELIMITER:  _ => '"',
        OPEN_BRACKET:      _ => '{',
        CLOSE_BRACKET:     _ => '}',
        THIN_ARROW:        _ => '->',
        COLON:             _ => ':',
        NAMESPACE_SEP:     _ => '::',
        OPEN_TYPEVARS:     _ => '<',
        CLOSE_TYPEVARS:    _ => '>',
        OPEN_DOC_COMMENT:  _ => '/*',
        CLOSE_DOC_COMMENT: _ => '*/',
        EOL:               _ => '\n',

        /* -------------------------------------------------------------------------------------- */
        /* -------------------------------- Tree-sitter specific -------------------------------- */
        /* -------------------------------------------------------------------------------------- */

        // NOTE: What follows is a "synthetic" rule (one not used directly by any of the grammar's
        //       productions) defined as the concatenation/union of the regexes for:
        //          - `$.name_identifier`,
        //          - `$.WASM_KEYWORD`,
        //          - `$.STACK_LITERAL_KEYWORD`, `$.INJECTED_LITERAL_KEYWORD`
        //  ...constructed using the above, spliced together with meta-character `|` (alternative/or)
        //
        //  Required by Treesitter to perform [Keyword Extraction](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html#keyword-extraction)
        //  on the sources for more accurate and higher performance parsing.
        //
        //  NEVER FORGET UPDATING (!) this rule in case more `%`-prefixed keywords get added!
        word: _ => /%(wasm|struct|stack|injected)|\$?[A-Za-z_][A-Za-z0-9_$]*/,
    },

    inline: $ => [
        $._directives, $.directive,
        $._impl_directive,

        $._decorators,
        $._import_alias,

        $._typevars_list_item,

        $._assign, $.of_type,
        $._grouped_type,
        $.union_type, $.intersect_type,
        $._atom_type, $._type_paren,
        // $._type,

        $._funtype_sig_params_list, //$.funtype_sig_param,
        $._typed_names_list,
        $._struct_members_decl, $._stack_namepair_list, $._function_signature_params,
        $._stack_namepairs,

        $._namespaced_qname,

        $.B_NOT_PRE_OP, $.UNARY_MINUS_OP,
        $.AS_KEYWORD, $.IS_KEYWORD,
        $.MUL_OP, $.ADD_OP, $.SHIFT_OP, $.REL_OP, $.EQ_OP,
        $.B_AND_OP, $.B_XOR_OP, $.B_OR_OP,
        $.LOGIC_AND_OP, $.LOGIC_OR_OP, $.LOGIC_NOT_OP,
        $.ASSIGN_OP,
    ],
});

// vim:ts=8 sw=4 et
