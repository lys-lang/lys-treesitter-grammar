/**
 * @file ⚜︎ A language that compiles to WebAssembly
 * @author Michał Schwarz <mschwarz@blckcomp.com>
 * @license BSD-3-Clause
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const kNameIdentifier = /\$?[A-Za-z_][A-Za-z0-9_$]*/;

const [kHexadecimalIntLiteral, kDecimalNumberLiteral] = [
    /0x[a-f0-9]+/i,

    // [+-]?(
    //       \d
    //     | [1-9]\d+
    //     | (0|[1-9]\d*)\.[0-9]*
    //     | \.[0-9]+
    // )(
    //     [eE][+-]?[1-9]\d*
    // )?
    /[+-]?(\d|[1-9]\d+|(0|[1-9]\d*)\.[0-9]*|\.[0-9]+)(e[+-]?[1-9]\d*)?/i,
];
const [kTrueBoolLiteral, kFalseBoolLiteral]  = [/true/, /false/];
const kStringLiteral = /"[^"]*"/iu;

/** @returns {RuleOrLiteral} */
function numeric_literal() {
    return token(choice(kHexadecimalIntLiteral, kDecimalNumberLiteral));
}

/** @returns {RuleOrLiteral} */
function boolean_literal() {
    return token(choice(alias(kTrueBoolLiteral, 'true'), alias(kFalseBoolLiteral, 'false')));
}

/** @returns {RuleOrLiteral} */
function string_literal() {
    return kStringLiteral;
}

module.exports = grammar({
    name: "lys",

    word: $ => $.word,
    externals: $ => [$.newline, $.line_comment, $.block_comment, $._err_sentinel],

    extras: $ => [
        /[ \t]/, $.newline,
    ],

    rules: {
        document: $ => $._directives,

        _directives: $ => repeat1(choice($.directive, $.line_comment, $.block_comment)),
        directive: $ => choice(
            prec(10, $._val_directive),
            prec(10, $._var_directive),
            prec( 9, $._type_directive),
            prec( 8, $._function_directive),
            prec( 7, $._struct_directive),
            prec( 6, $._enum_directive),
            prec( 5, $._impl_directive),
            prec( 4, $._import_directive),
            // prec( 5, $._trait_directive),
            // prec( 4, $._effect_directive),
        ),

        /* -------------------------------------------------------------------------------------- */
        /* ---------------------------------- Basic Statements ---------------------------------- */
        /* -------------------------------------------------------------------------------------- */
        _function_directive: $ => seq(optional($._decorators), optional($.private_modifier), $.fun_declaration),
        _val_directive:      $ => seq(optional($.private_modifier), $.val_declaration),
        _var_directive:      $ => seq(optional($.private_modifier), $.var_declaration),
        _struct_directive:   $ => seq(optional($.private_modifier), $.struct_declaration),
        _type_directive:     $ => seq(optional($.private_modifier), $.type_declaration),
        _enum_directive:     $ => seq(optional($.private_modifier), $.enum_declaration),
        _impl_directive:     $ => seq(optional($.private_modifier), $.impl_block),
        _import_directive:   $ => seq($.import_declaration),
        // _trait_directive:    $ => seq(optional($.private_modifier), $.trait_declaration),
        // _effect_directive:   $ => seq(optional($.private_modifier), $.effect_declaration),

        _impl_inner_directive: $ => choice(
            $._function_directive,
            $._val_directive,
            $._var_directive,
        ),

        decorator: $ => seq(
            alias($.OPEN_DECORATION, '#['),
            field("decoration", seq($.name_identifier, repeat($.literal))),
            alias($.CLOSE_ARRAY, ']'),
        ),
        private_modifier: $ => field("vis", alias($.PRIVATE_KEYWORD, 'private')),

        _decorators: $ => repeat1($.decorator),

        loop_expression:      $ => seq(alias($.LOOP_KEYWORD, 'loop'), prec.right(field("expr", $._expression))),
        continue_statement:   $ => seq(alias($.CONTINUE_KEYWORD, 'continue')),
        break_statement:      $ => seq(alias($.BREAK_KEYWORD, 'break')),
        match_expression:     $ => seq(alias($.MATCH_KEYWORD, 'match'), $._match_expr_body),
        if_expression:        $ => seq(alias($.IF_KEYWORD, 'if'), $._if_expr_body),
        if_else_expression:   $ => seq(alias($.ELSE_KEYWORD, 'else'), $._if_else_body),
        case_expression:      $ => seq(alias($.CASE_KEYWORD, 'case'), $._case_expr_body),
        case_else_expression: $ => seq(alias($.ELSE_KEYWORD, 'else'), $._case_else_body),
        wasm_expression:      $ => seq(alias($.WASM_KEYWORD, '%wasm'), $._wasm_lit_body),
        struct_literal:       $ => seq(alias($.STRUCT_LIT_KEYWORD, '%struct'), $._struct_lit_body),
        stack_literal:        $ => seq(alias($.STACK_LIT_KEYWORD, '%stack'), optional($._stack_namepair_list)),
        injected_literal:     $ => seq(alias($.INJECTED_LIT_KEYWORD, '%injected'), blank()),

        fun_declaration: $ => seq(
            alias($.FUN_KEYWORD, 'fun'), field("name", $._function_name),
            // field("typevars", optional($.type_variables)),
            $._function_signature_params,
            optional(field("return_type", $.of_type)),
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
            field("members", $._struct_members_decl),
        ),
        type_declaration: $ => seq(
            alias($.TYPE_KEYWORD, 'type'),
            field("name", $.name_identifier),
            prec.right($._type_assign),
        ),
        enum_declaration: $ => seq(
            alias($.ENUM_KEYWORD, 'enum'),
            field("name", $.name_identifier),
            $._enum_variants_decl,
        ),
        impl_block: $ => seq(
            alias($.IMPL_KEYWORD, 'impl'),
            choice(
                field("self_type", alias($.namedtype, $.selftype)),
                seq(
                    field("impl_type", alias($.namedtype, $.impltype)),
                    alias($.FOR_KEYWORD, 'for'),
                    field("self_type", alias($.namedtype, $.selftype)),
                ),
            ),
        ),
        import_declaration: $ => seq(
            alias($.IMPORT_KEYWORD, 'import'),
            field("path", $.qname),
            optional($._import_alias),
        ),
        // trait_declaration: $ => seq(
        //     alias($.TRAIT_KEYWORD, 'trait'),
        //     field("name", $.name_identifier),
        //     $._trait_methods_decl,
        // ),
        // effect_declaration: $ => seq(
        //     alias($.EFFECT_KEYWORD, 'effect'),
        //     $.name_identifier, field("typevars", optional($.type_variables)),
        //     $._effect_element_list
        // ),

        _import_alias: $ => seq(alias($.AS_KEYWORD, 'as'), field("alias", $.name_identifier)),

        value_type: $ => seq('=', $._type_assign),
        unknown_expression: _ => '???',

        _match_elements: $ => choice($._case_expr_body, $._case_else_body),

        _if_expr_body: $ => prec.left(seq(
            // Optional parentheses here makes this a strict superset of the grammar
            // the compiler actually accepts, as a grouped expression is an expression
            // nonetheless
            seq(
                // alias($.OPEN_PAREN, '('),
                field("condition", $._expression),
                // alias($.CLOSE_PAREN, ')'),
            ),
            field("if", alias($._expression, $.if_expr_body)),
            optional(
                seq(alias($.ELSE_KEYWORD, 'else'), field("else", alias($._expression, $.else_expr_body))),
            ),
        )),

        _if_else_body: $ => seq(
            field("condition", optional($.name_identifier)),
            $.THIN_ARROW, field("expr", $._expression),
        ),
        _case_expr_body: $ => choice(
            /* ------------------------------- CaseCondition ---------------------------- */
            seq(
                field("pattern", $.name_identifier),
                alias($.IF_KEYWORD, 'if'), field("case_condition", $._expression),
                $.THIN_ARROW, field("expr", $._expression),
            ),

            /* -------------------------------- CaseLiteral ----------------------------- */
            seq(
                field("pattern", $.literal),
                $.THIN_ARROW, field("expr", $._expression),
            ),

            /* --------------------------------- CaseIs --------------------------------- */
            seq(
                field("alias", optional($.name_identifier)),
                alias($.IS_KEYWORD, 'is'),
                field("pattern", $.match_pattern),
                optional(
                    seq($.THIN_ARROW, field("expr", $._expression)),
                ),
            ),
        ),
        _case_else_body: $ => seq(
            /* -------------------------------- CaseElse -------------------------------- */
            field("value", optional($.name_identifier)),
            $.THIN_ARROW, field("expr", $._expression),
        ),
        _match_expr_body: $ => prec.left(
            seq(
                field("match", optional(alias($._expression, $.match_expr))),
                alias($.OPEN_BRACKET, '{'),
                repeat1($._match_body_elem),
                alias($.CLOSE_BRACKET, '}'),
            ),
        ),
        _struct_lit_body: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            optional($.typed_names_list),
            alias($.CLOSE_BRACKET, '}'),
        ),
        _wasm_lit_body: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            repeat($.satom),
            alias($.CLOSE_BRACKET, '}'),
        ),

        _match_body_elem: $ => choice(
            seq(alias($.CASE_KEYWORD, 'case'), $._case_expr_body),
            seq(alias($.ELSE_KEYWORD, 'else'), $._case_else_body),
        ),

        match_pattern: $ => seq(
            field("constructor", $.reference),
            field("fields", optional(
                seq(alias($.OPEN_PAREN, '('), repeat($._match_pattern_fields), alias($.CLOSE_PAREN, ')')),
            )),
        ),
        _match_pattern_fields: $ => seq(
            alias($.name_identifier, $.field_name),
            optional(
                seq(alias($.COLON, ':'), $.name_identifier),
            ),
            optional(','),
        ),

        /* -------------------------------------------------------------------------------------- */
        /* ----------------------------------- Type Declarations -------------------------------- */
        /* -------------------------------------------------------------------------------------- */
        // typevar: _ => /[A-Z][A-Za-z0-9_]*/,
        // type_variables: $ => seq(
        //     alias($.OPEN_TYPEVARS, '<'),
        //     repeat($._typevars_list_item),
        //     alias($.CLOSE_TYPEVARS, '>'),
        // ),
        // _typevars_list_item: $ => seq($.typevar, optional(',')),

        of_type: $ => seq(alias($.COLON, ':'), /* optional($.function_effect), */ $._type),

        _assign: $ => seq(alias($.ASSIGN_OP, '='),
                choice(
                    field("expr", $._expression),
                    field("expr", $.unknown_expression),
                ),
            ),
        _type_assign: $ => seq(alias($.ASSIGN_OP, '='),
            choice(
                field("decl", $._type),
                field("decl", $.struct_literal),
                field("decl", $.stack_literal),
                field("decl", $.injected_literal),
            ),
        ),
        _fun_assign_expression: $ => seq(alias($.ASSIGN_OP, '='),
            choice(
                field("body", $._expression),
                field("body", $.wasm_expression),
                field("body", $.unknown_expression),
            ),
        ),

        _struct_members_decl: $ => seq(
            alias($.OPEN_PAREN, '('),
            optional($.typed_names_list),
            alias($.CLOSE_PAREN, ')'),
        ),
        _enum_variants_decl: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            // optional(field("variants", $.typed_names_list)),
            optional(field("variants", repeat1($.typed_name))),
            alias($.CLOSE_BRACKET, '}'),
        ),
        _stack_namepair_list: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            optional($._stack_namepairs),
            alias($.CLOSE_BRACKET, '}'),
        ),
        _function_signature_params: $ => seq(
            alias($.OPEN_PAREN, '('),
            optional(field("signature", $.typed_names_list)),
            alias($.CLOSE_PAREN, ')'),
        ),
        // _trait_methods_decl: $ => seq(
        //     alias($.OPEN_BRACKET, '{'),
        //     optional(field("methods", $._trait_decl_elements)),
        //     alias($.CLOSE_BRACKET, '}'),
        // ),

        // effect_member_declaration: $ => seq($.name_identifier, $._function_signature_params, $.of_type),
        // _trait_decl_elements: $ => repeat1($.fun_declaration),
        // _effect_elements:     $ => repeat1($.effect_member_declaration),

        _stack_namepairs: $ => repeat1($.name_literal_pair),

        typed_names_list: $ => repeat1(seq($.typed_name, optional(','))),
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
        // function_effect: $ => seq(
        //     alias($.OPEN_TYPEVARS, '<'),
        //     optional($._type),
        //     alias($.CLOSE_TYPEVARS, '>'),
        // ),

        // _effect_element_list: $ => seq(
        //     alias($.OPEN_BRACKET, '{'),
        //     optional($._effect_elements),
        //     alias($.CLOSE_BRACKET, '}'),
        // ),

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

        functiontype: $ => seq(
            alias($.FUN_KEYWORD, 'fun'),
            // field("typevars", optional($.type_variables)),
            $._funtype_sig_params_list,
            $.THIN_ARROW, field("return_type", $._type),
        ),
        _funtype_sig_params_list: $ => seq(
            alias($.OPEN_PAREN, '('), repeat($.funtype_sig_param), alias($.CLOSE_PAREN, ')'),
        ),
        funtype_sig_param: $ => seq(
            optional($.function_param_name), field("param_type", $._type), optional(','),
        ),
        function_param_name: $ => seq(field("param_name", $.name_identifier), alias($.COLON, ':')),

        /* -------------------------------------------------------------------------------------- */
        /* ------------------------------------- Expressions ------------------------------------ */
        /* -------------------------------------------------------------------------------------- */
        _expression: $ => choice(
            $.if_expression,
            $.match_expression,
            $.loop_expression,
            $.break_statement,
            $.continue_statement,
            $.value_expr,
        ),
        _statement: $ => choice(
            $.val_declaration,
            $.var_declaration,
            $.fun_declaration,
            $._expression,
        ),
        _value: $ => choice(
            prec(100, $.literal),
            prec(100, $.reference),
            prec(101, $.block_expr),
            prec(102, $._grouped_expr),
        ),

        // Precedence in accordance [with Java](https://introcs.cs.princeton.edu/java/11precedence)
        value_expr: $ => choice(
            prec.left(15, $._atomic_expression),
            prec.left(14, $._unary_expression),
            prec.left(13, $.cast_expression),
            prec.left(12, seq($._expression, $.MUL_OP,   $._expression)),
            prec.left(11, seq($._expression, $.ADD_OP,   $._expression)),
            prec.left(10, seq($._expression, $.SHIFT_OP, $._expression)),
            prec.left( 9, seq($._expression, $.REL_OP,   $._expression)),
            prec.left( 8, seq($._expression, $.EQ_OP,    $._expression)),
            prec.left( 7, seq($._expression, $.B_AND_OP, $._expression)),
            prec.left( 6, seq($._expression, $.B_XOR_OP, $._expression)),
            prec.left( 5, seq($._expression, $.B_OR_OP,  $._expression)),
            prec.left( 4, seq($._expression, $.LOGIC_AND_OP, $._expression)),
            prec.left( 3, seq($._expression, $.LOGIC_OR_OP,  $._expression)),
            prec.right(1, seq($._expression, $.ASSIGN_OP, $._expression))
        ),

        _unary_expression: $ => choice(
            prec.left(seq($.LOGIC_NOT_OP,   $._expression)),
            prec.left(seq($.B_NOT_PRE_OP,   $._expression)),
            prec.left(seq($.UNARY_MINUS_OP, $._expression)),
        ),
        _atomic_expression: $ => choice(
            prec(53, $.subscript_expr),
            prec(52, $.apply_fun_expr),
            prec(51, $.member_deref_expr),
            prec(50, $._value),
        ),

        subscript_expr:    $ => prec.left(seq(field("seq", $._value), repeat1($._index_deref_expr))),
        apply_fun_expr:    $ => prec.left(seq(field("fun", $._value), repeat1($._call_args_expr))),
        member_deref_expr: $ => prec.left(seq(field("rec", $._value), repeat1($._member_deref_expr))),

        cast_expression: $ => choice(
            prec.left(seq($._expression, alias($.AS_KEYWORD, 'as'), $._expression)),
            prec.left(seq($._expression, alias($.IS_KEYWORD, 'is'), $._expression)),
        ),

        _member_deref_expr: $ => seq($.MEMBER_OP, $.name_identifier),
        _index_deref_expr:  $ => seq(alias($.OPEN_ARRAY, '['), $._expression, alias($.CLOSE_ARRAY, ']')),
        _call_args_expr:    $ => seq($._call_args),

        _call_args: $ => seq(
            alias($.OPEN_PAREN, '('),
            repeat(seq($._expression, optional(','))),
            alias($.CLOSE_PAREN, ')'),
        ),

        _grouped_expr: $ => seq(
            alias($.OPEN_PAREN, '('),
            $._expression,
            alias($.CLOSE_PAREN, ')'),
        ),
        block_expr: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            choice(
                // XXX: do we actually *need* that `$.newline` to be here...?
                //repeat1(seq($._statement, repeat($.newline))),
                repeat1($._statement),
                blank(),
            ),
            alias($.CLOSE_BRACKET, '}'),
        ),

        namedtype: $ => prec.left($.qname),
        reference: $ => prec.left($.qname),

        literal: $ => choice(
            alias(numeric_literal(), $.number),
            alias(boolean_literal(), $.boolean),
            alias(string_literal(), $.string),
        ),

        numeric_literal: _ => alias(token(choice(kHexadecimalIntLiteral, kDecimalNumberLiteral)), 'number'),

        name_identifier: _ => kNameIdentifier,
        qname: $ => choice(
            prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),
            prec(2, field("segment", $.name_identifier)),
        ),

        _namespaced_qname: $ => prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),

        name_literal_pair: $ => seq(
            field("name", $.name_identifier),
            alias($.ASSIGN_OP, '='),
            field("value", $.literal),
            optional(','),
        ),

        /* -------------------------------------------------------------------------------------- */
        /* --------------------------------- WASM S-Expressions --------------------------------- */
        /* -------------------------------------------------------------------------------------- */
        satom: $ => choice(
            $.sexpression,
            $.numeric_literal,
            $.qname, $.ssymbol,
        ),

        sexpression: $ => seq(
            alias($.OPEN_PAREN, '('),
            repeat1($.satom),
            alias($.CLOSE_PAREN, ')'),
        ),

        ssymbol: _ => /[a-z][a-z0-9_.\/]*/i,

        /* -------------------------------------------------------------------------------------- */
        /* -------------------------------- Nonterminals/Keywords ------------------------------- */
        /* -------------------------------------------------------------------------------------- */
        WASM_KEYWORD:         _ => '%wasm',
        STRUCT_LIT_KEYWORD:   _ => '%struct',
        STACK_LIT_KEYWORD:    _ => '%stack',
        INJECTED_LIT_KEYWORD: _ => '%injected',

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
        IF_KEYWORD:       _ => 'if',
        ELSE_KEYWORD:     _ => 'else',
        MATCH_KEYWORD:    _ => 'match',
        TRUE_KEYWORD:     _ => kTrueBoolLiteral,
        FALSE_KEYWORD:    _ => kFalseBoolLiteral,

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
            $.STRUCT_LIT_KEYWORD,
            $.WASM_KEYWORD, $.STACK_LIT_KEYWORD, $.INJECTED_LIT_KEYWORD,
        )),

        /* -------------------------------------------------------------------------------------- */
        /* ---------------------------------- Operator Tokens ----------------------------------- */
        /* -------------------------------------------------------------------------------------- */
        LOGIC_NOT_OP:   _ => '!',
        B_NOT_PRE_OP:   _ => '~',
        UNARY_MINUS_OP: _ => '-',
        AS_KEYWORD:     _ => 'as',
        IS_KEYWORD:     _ => 'is',
        MUL_OP:         _ => token(choice('**', '*', '/', '%')),
        ADD_OP:         _ => token(choice('++', '+', '-')),
        SHIFT_OP:       _ => token(choice('>>>', '>>', '<<')),
        REL_OP:         _ => token(choice('>=', '<=', '>', '<')),
        EQ_OP:          _ => token(choice('===', '!==', '~=', '==', '!=')),
        B_AND_OP:       _ => '&',
        B_XOR_OP:       _ => '^',
        B_OR_OP:        _ => '|',
        LOGIC_AND_OP:   _ => '&&',
        LOGIC_OR_OP:    _ => '||',
        MEMBER_OP:      _ => token(choice('.^', '.')),
        ASSIGN_OP:      _ => '=',

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

        /* -------------------------------------------------------------------------------------- */
        /* -------------------------------- Tree-sitter specific -------------------------------- */
        /* -------------------------------------------------------------------------------------- */

        // NOTE: What follows is a "synthetic" rule (one not used directly by any of the grammar's
        //       productions) defined as the concatenation/union of the regexes for:
        //          - `$.name_identifier`,
        //          - `$.WASM_KEYWORD`,
        //          - `$.STACK_LIT_KEYWORD`, `$.INJECTED_LIT_KEYWORD`
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

        //$.type_variables,
        // $._typevars_list_item,

        $._assign, $._fun_assign_expression,
        $.of_type,
        $._grouped_type,

        $._value, $.value_expr,
        $._funtype_sig_params_list, $.funtype_sig_param, $.function_param_name,
        //$.typed_names_list,
        $._struct_members_decl, $._stack_namepair_list, $._function_signature_params,
        $._stack_namepairs,
        // $._trait_decl_elements, $._effect_elements, $._effect_element_list,

        $._namespaced_qname,

        $._statement,
        $._atomic_expression,
        $.cast_expression, $._unary_expression,
        $._member_deref_expr, $._index_deref_expr, $._call_args_expr,
        $._grouped_expr,

        $.satom,
    ],
});

// vim:ts=8 sw=4 et
