/**
 * @file ⚜︎ A language that compiles to WebAssembly
 * @author Michał Schwarz <mschwarz@blckcomp.com>
 * @license BSD-3-Clause
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const kNameIdentifier = /\$?[A-Za-z_][A-Za-z0-9_$]*/;

const [kDecimalNumberLiteral, kHexadecimalIntLiteral] = [
    /0x[a-f0-9]+/,

    // [+-]?(
    //       \d
    //     | [1-9]\d+
    //     | (0|[1-9]\d*)\.[0-9]*
    //     | \.[0-9]+
    // )(
    //     [eE][+-]?[1-9]\d*
    // )?
    /[+-]?(\d|[1-9]\d+|(0|[1-9]\d*)\.[0-9]*|\.[0-9]+)([eE][+-]?[1-9]\d*)?/,
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

/**
 * @param {GrammarSymbols<"reference">} $
 *
 * @returns {Rule}
 */
function postfixnum_literal($) {
    return token(
        prec(900,
            seq(numeric_literal(), alias(kNameIdentifier, $.reference)),
        ),
    );
}

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

        /* -------------------------------------------------------------------------------------- */
        /* ---------------------------------- Basic Statements ---------------------------------- */
        /* -------------------------------------------------------------------------------------- */
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
            field("decorator", seq($.name_identifier, repeat($.literal))),
            alias($.CLOSE_ARRAY, ']'),
        ),

        private_modifier: $ => field("vis", alias($.PRIVATE_KEYWORD, 'private')),
        loop_expression:  $ => seq(alias($.LOOP_KEYWORD, 'loop'), $._expression),
        continue_statement: $ => seq(alias($.CONTINUE_KEYWORD, 'continue')),
        break_statement:    $ => seq(alias($.BREAK_KEYWORD, 'break')),
        match_expression:   $ => seq(alias($.MATCH_KEYWORD, 'match')),


        fun_declaration: $ => seq(
            alias($.FUN_KEYWORD, 'fun'), field("name", $._function_name),
            optional($._type_variables), $._function_signature_params,
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
            $._struct_members_decl,
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
        trait_declaration: $ => seq(
            alias($.TRAIT_KEYWORD, 'trait'),
            field("name", $.name_identifier),
            $._trait_methods_decl,
        ),
        import_declaration: $ => seq(
            alias($.IMPORT_KEYWORD, 'import'),
            field("path", $.qname),
            optional($._import_alias),
        ),
        effect_declaration: $ => seq(
            alias($.EFFECT_KEYWORD, 'effect'),
            $.name_identifier, optional($._type_variables), $._effect_element_list
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

        _import_alias: $ => seq(alias($.AS_KEYWORD, 'as'), field("alias", $.name_identifier)),

        value_type:         $ => seq('=', $._type_assign),
        unknown_expression: _ => '???',
        wasm_expression:    _ => '___wasm expression___',

        /* -------------------------------------------------------------------------------------- */
        /* --------------------------------- Type Declarations ---------------------------------- */
        /* -------------------------------------------------------------------------------------- */
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
            repeat(field("typevars", $._typevars_list_item)),
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
            field("decl",
                choice(
                    $._type,
                    $.struct_literal,
                    $.stack_literal,
                    $.injected_literal,
                )),
            ),
        _fun_assign_expression: $ => seq(alias($.ASSIGN_OP, '='),
            field("fun",
                choice(
                    $._expression,
                    $.wasm_expression,
                    $.unknown_expression,
                ),
            )),

        _value: $ => choice(
            prec(100, $.literal),
            prec(100, $.reference),
            prec(101, $.block_expr),
            prec(102, $._grouped_expr),
        ),

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
        _trait_methods_decl: $ => seq(
            alias($.OPEN_BRACKET, '{'),
            optional(field("methods", $._trait_decl_elements)),
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

        effect_member_declaration: $ => seq($.name_identifier, $._function_signature_params, $.of_type),
        _trait_decl_elements: $ => repeat1($.fun_declaration),
        _effect_elements:     $ => repeat1($.effect_member_declaration),

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

        _effect_element_list: $ => seq(alias($.OPEN_BRACKET, '{'), optional($._effect_elements), alias($.CLOSE_BRACKET, '}')),

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

        /* -------------------------------------------------------------------------------------- */
        /* ------------------------------------- Expressions ------------------------------------ */
        /* -------------------------------------------------------------------------------------- */
        _expression: $ => choice(
            $._value_expr,
        ),
        _statement: $ => choice(
            $.val_declaration,
            $.var_declaration,
            $.fun_declaration,
            $._expression,
        ),

        // Precedence in accordance [with Java](https://introcs.cs.princeton.edu/java/11precedence)
        _value_expr: $ => choice(
            prec.left(15, $._atomic_expression),
            prec.left(14, $._unary_expression),
            prec.left(13, $._cast_expression),
            prec.left(12, seq($._expression, $.MUL_OP,   $._expression)),
            prec.left(11, seq($._expression, $.ADD_OP,   $._expression)),
            prec.left(10, seq($._expression, $.SHIFT_OP, $._expression)),
            prec.left( 9, seq($._expression, $.REL_OP,   $._expression)),
            prec.left( 8, seq($._expression, $.EQ_OP,    $._expression)),
            prec.left( 7, seq($._expression, alias($.B_AND_OP, '&'), $._expression)),
            prec.left( 6, seq($._expression, alias($.B_XOR_OP, '^'), $._expression)),
            prec.left( 5, seq($._expression, alias($.B_OR_OP, '|'),  $._expression)),
            prec.left( 4, seq($._expression, alias($.LOGIC_AND_OP, '&&'), $._expression)),
            prec.left( 3, seq($._expression, alias($.LOGIC_OR_OP, '||'),  $._expression)),
            prec.right(1, seq($._expression, alias($.ASSIGN_OP, '='), $._expression))
        ),

        _unary_expression: $ => choice(
            prec.left(seq(alias($.LOGIC_NOT_OP, '!'),   $._expression)),
            prec.left(seq(alias($.B_NOT_PRE_OP, '~'),   $._expression)),
            prec.left(seq(alias($.UNARY_MINUS_OP, '-'), $._expression)),
        ),
        _cast_expression: $ => choice(
            prec.left(seq($._expression, alias($.AS_KEYWORD, 'as'), $._expression)),
            prec.left(seq($._expression, alias($.IS_KEYWORD, 'is'), $._expression)),
        ),
        _atomic_expression: $ => choice(
            prec(53, $.subscript_expr),
            prec(52, $.apply_fun_expr),
            prec(51, $.member_deref_expr),
            prec(50, $._value),
        ),

        subscript_expr:    $ => prec.left(seq($._value, repeat1($._index_deref_expr))),
        apply_fun_expr:    $ => prec.left(seq($._value, repeat1($._call_args_expr))),
        member_deref_expr: $ => prec.left(seq($._value, repeat1($._member_deref_expr))),

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
            optional(
                seq($._statement, optional(seq(repeat1($.EOL), $._statement)), optional($.EOL)),
            ),
            alias($.CLOSE_BRACKET, '}'),
        ),

        namedtype: $ => prec.left($.qname),
        reference: $ => prec.left($.qname),

        literal: $ => choice(
            alias(numeric_literal(), $.number),
            alias(boolean_literal(), $.boolean),
            alias(string_literal(), $.string),
            //alias(postfixnum_literal($), $.postfix_number),
        ),

        // string_literal:   _ => kStringLiteral,
        // _hexadec_literal: _ => kHexadecimalIntLiteral,
        // _decimal_literal: _ => kDecimalNumberLiteral,

        // numeric_literal: _ => token(choice(kHexadecimalIntLiteral, kDecimalNumberLiteral)),
        // postfixnum_literal: $ => postfixnum_literal($),

        // bool_literal: _ => token(boolean_literal()),

        name_identifier: _ => kNameIdentifier,
        qname: $ => choice(
            prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),
            prec(2, $.name_identifier),
        ),

        _namespaced_qname: $ => prec.right(1, seq($.qname, alias($.NAMESPACE_SEP, '::'), $.qname)),

        name_literal_pair: $ => seq(
            field("name", $.name_identifier),
            alias($.ASSIGN_OP, '='),
            field("value", $.literal),
            optional(','),
        ),

        /* -------------------------------------------------------------------------------------- */
        /* -------------------------------- Nonterminals/Keywords ------------------------------- */
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
            $.STRUCT_LITERAL_KEYWORD,
            $.WASM_KEYWORD, $.STACK_LITERAL_KEYWORD, $.INJECTED_LITERAL_KEYWORD,
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

        $._type_variables,
        $._typevars_list_item,

        $._assign, $._fun_assign_expression,
        $.of_type,
        $._grouped_type,

        $._value,
        $._funtype_sig_params_list, $.funtype_sig_param, $.function_param_name,
        $._typed_names_list,
        $._struct_members_decl, $._stack_namepair_list, $._function_signature_params,
        $._stack_namepairs,
        $._trait_decl_elements, $._effect_elements, $._effect_element_list,

        $._namespaced_qname,

        $._statement,
        $._atomic_expression,
        $._cast_expression, $._unary_expression,
        $._member_deref_expr, $._index_deref_expr, $._call_args_expr,
        $._grouped_expr,
    ],
});

// vim:ts=8 sw=4 et
