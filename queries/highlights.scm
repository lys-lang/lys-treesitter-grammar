[
  "fun"
  "import"
  "val" "var"
  "is" "as"
  "match" "case"
  "if" "else"
  "for" "loop" "continue" "break"
  "struct" "enum"
  "type"
] @keyword

[
  "private"
] @attribute

[
  "%wasm"
  "%struct"
  "%stack"
] @tag

[
  (LOGIC_NOT_OP) (B_NOT_PRE_OP) (UNARY_MINUS_OP)
  (MUL_OP) (ADD_OP) (SHIFT_OP)
  (REL_OP) (EQ_OP)
  (B_AND_OP) (B_XOR_OP) (B_OR_OP)
  (LOGIC_AND_OP) (LOGIC_OR_OP)
  (MEMBER_OP)
  (ASSIGN_OP) "="
] @operator

[
  "{" "}"
  ","

  (THIN_ARROW)
] @punctuation.delimiter

(number)	@number
(string)	@string
(boolean)	@constant.builtin

[
  (line_comment)
  (block_comment)
] @comment

(decorator)	@tag

(fun_declaration [
    name: (name_identifier) @function
    ;; typevars: (type_variables
    ;;             (typevar) @type)
    signature: (typed_names_list
                (typed_name name: (name_identifier) @variable.parameter
                            type: [(namedtype) @type]))
    return_type: (namedtype) @type
  ])

(reference (qname segment: (name_identifier) @variable.parameter))
((reference (qname segment: (name_identifier) @variable)) (#is-not? local))

(apply_fun_expr fun: (reference (qname segment: (name_identifier) @function)))
(apply_fun_expr fun: (reference (qname segment: (name_identifier) @variable)) (#is-not? local))

(functiontype [
    ;; typevars: (type_variables
    ;;             (typevar) @type)
    param_name: (name_identifier) @variable.parameter
    return_type: (namedtype) @type
  ])

(type_declaration name: (name_identifier) @type)

(struct_declaration [
    typename: (name_identifier) @constructor
    members: (typed_names_list
      (typed_name [
          name: (name_identifier) @property
          type: (namedtype (qname segment: (name_identifier) @type))
        ]))
  ])

(struct_declaration [ "(" ")" ] @punctuation.delimiter)

(struct_literal
  (typed_names_list
    (typed_name [
      name: (name_identifier) @property
      type: (namedtype (qname segment: (name_identifier) @type))
    ])
  ))

(stack_literal
  (name_literal_pair [
    name: (name_identifier) @property
  ]))

; vim:ts=8 sw=2 noet
