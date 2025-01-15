#include "tree_sitter/parser.h"

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 73
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 34
#define ALIAS_COUNT 0
#define TOKEN_COUNT 19
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 7
#define PRODUCTION_ID_COUNT 1

enum ts_symbol_identifiers {
  anon_sym_as = 1,
  sym_unknown_expression = 2,
  anon_sym_EQ = 3,
  anon_sym_LT = 4,
  anon_sym_GT = 5,
  anon_sym_PIPE = 6,
  anon_sym_AMP = 7,
  sym_function_type_literal = 8,
  sym_expression = 9,
  sym_name_identifier = 10,
  anon_sym_COLON_COLON = 11,
  sym_VAL_KEYWORD = 12,
  sym_VAR_KEYWORD = 13,
  sym_IMPORT_KEYWORD = 14,
  sym_PRIVATE_KEYWORD = 15,
  sym_OPEN_PAREN = 16,
  sym_CLOSE_PAREN = 17,
  sym_COLON = 18,
  sym_document = 19,
  sym_val_directive = 20,
  sym_var_directive = 21,
  sym_import_directive = 22,
  sym_private_modifier = 23,
  sym_val_declaration = 24,
  sym_var_declaration = 25,
  sym_function_effect = 26,
  sym_type = 27,
  sym_reference = 28,
  sym_qname = 29,
  aux_sym_directives_repeat1 = 30,
  aux_sym_union_type_repeat1 = 31,
  aux_sym_intersection_type_repeat1 = 32,
  aux_sym_qname_repeat1 = 33,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_as] = "as",
  [sym_unknown_expression] = "unknown_expression",
  [anon_sym_EQ] = "=",
  [anon_sym_LT] = "<",
  [anon_sym_GT] = ">",
  [anon_sym_PIPE] = "|",
  [anon_sym_AMP] = "&",
  [sym_function_type_literal] = "function_type_literal",
  [sym_expression] = "expression",
  [sym_name_identifier] = "name_identifier",
  [anon_sym_COLON_COLON] = "::",
  [sym_VAL_KEYWORD] = "val",
  [sym_VAR_KEYWORD] = "var",
  [sym_IMPORT_KEYWORD] = "import",
  [sym_PRIVATE_KEYWORD] = "private",
  [sym_OPEN_PAREN] = "(",
  [sym_CLOSE_PAREN] = ")",
  [sym_COLON] = ":",
  [sym_document] = "document",
  [sym_val_directive] = "val_directive",
  [sym_var_directive] = "var_directive",
  [sym_import_directive] = "import_directive",
  [sym_private_modifier] = "private_modifier",
  [sym_val_declaration] = "val_declaration",
  [sym_var_declaration] = "var_declaration",
  [sym_function_effect] = "function_effect",
  [sym_type] = "type",
  [sym_reference] = "reference",
  [sym_qname] = "qname",
  [aux_sym_directives_repeat1] = "directives_repeat1",
  [aux_sym_union_type_repeat1] = "union_type_repeat1",
  [aux_sym_intersection_type_repeat1] = "intersection_type_repeat1",
  [aux_sym_qname_repeat1] = "qname_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [anon_sym_as] = anon_sym_as,
  [sym_unknown_expression] = sym_unknown_expression,
  [anon_sym_EQ] = anon_sym_EQ,
  [anon_sym_LT] = anon_sym_LT,
  [anon_sym_GT] = anon_sym_GT,
  [anon_sym_PIPE] = anon_sym_PIPE,
  [anon_sym_AMP] = anon_sym_AMP,
  [sym_function_type_literal] = sym_function_type_literal,
  [sym_expression] = sym_expression,
  [sym_name_identifier] = sym_name_identifier,
  [anon_sym_COLON_COLON] = anon_sym_COLON_COLON,
  [sym_VAL_KEYWORD] = sym_VAL_KEYWORD,
  [sym_VAR_KEYWORD] = sym_VAR_KEYWORD,
  [sym_IMPORT_KEYWORD] = sym_IMPORT_KEYWORD,
  [sym_PRIVATE_KEYWORD] = sym_PRIVATE_KEYWORD,
  [sym_OPEN_PAREN] = sym_OPEN_PAREN,
  [sym_CLOSE_PAREN] = sym_CLOSE_PAREN,
  [sym_COLON] = sym_COLON,
  [sym_document] = sym_document,
  [sym_val_directive] = sym_val_directive,
  [sym_var_directive] = sym_var_directive,
  [sym_import_directive] = sym_import_directive,
  [sym_private_modifier] = sym_private_modifier,
  [sym_val_declaration] = sym_val_declaration,
  [sym_var_declaration] = sym_var_declaration,
  [sym_function_effect] = sym_function_effect,
  [sym_type] = sym_type,
  [sym_reference] = sym_reference,
  [sym_qname] = sym_qname,
  [aux_sym_directives_repeat1] = aux_sym_directives_repeat1,
  [aux_sym_union_type_repeat1] = aux_sym_union_type_repeat1,
  [aux_sym_intersection_type_repeat1] = aux_sym_intersection_type_repeat1,
  [aux_sym_qname_repeat1] = aux_sym_qname_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [anon_sym_as] = {
    .visible = true,
    .named = false,
  },
  [sym_unknown_expression] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PIPE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AMP] = {
    .visible = true,
    .named = false,
  },
  [sym_function_type_literal] = {
    .visible = true,
    .named = true,
  },
  [sym_expression] = {
    .visible = true,
    .named = true,
  },
  [sym_name_identifier] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_COLON_COLON] = {
    .visible = true,
    .named = false,
  },
  [sym_VAL_KEYWORD] = {
    .visible = true,
    .named = false,
  },
  [sym_VAR_KEYWORD] = {
    .visible = true,
    .named = false,
  },
  [sym_IMPORT_KEYWORD] = {
    .visible = true,
    .named = false,
  },
  [sym_PRIVATE_KEYWORD] = {
    .visible = true,
    .named = false,
  },
  [sym_OPEN_PAREN] = {
    .visible = true,
    .named = false,
  },
  [sym_CLOSE_PAREN] = {
    .visible = true,
    .named = false,
  },
  [sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [sym_document] = {
    .visible = true,
    .named = true,
  },
  [sym_val_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_var_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_import_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_private_modifier] = {
    .visible = true,
    .named = true,
  },
  [sym_val_declaration] = {
    .visible = true,
    .named = true,
  },
  [sym_var_declaration] = {
    .visible = true,
    .named = true,
  },
  [sym_function_effect] = {
    .visible = true,
    .named = true,
  },
  [sym_type] = {
    .visible = true,
    .named = true,
  },
  [sym_reference] = {
    .visible = true,
    .named = true,
  },
  [sym_qname] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_directives_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_union_type_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_intersection_type_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_qname_repeat1] = {
    .visible = false,
    .named = false,
  },
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 21,
  [22] = 22,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 27,
  [28] = 28,
  [29] = 29,
  [30] = 30,
  [31] = 31,
  [32] = 32,
  [33] = 33,
  [34] = 34,
  [35] = 35,
  [36] = 36,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 41,
  [42] = 42,
  [43] = 43,
  [44] = 44,
  [45] = 45,
  [46] = 46,
  [47] = 47,
  [48] = 48,
  [49] = 49,
  [50] = 50,
  [51] = 51,
  [52] = 52,
  [53] = 53,
  [54] = 54,
  [55] = 55,
  [56] = 56,
  [57] = 57,
  [58] = 58,
  [59] = 59,
  [60] = 60,
  [61] = 61,
  [62] = 62,
  [63] = 63,
  [64] = 64,
  [65] = 65,
  [66] = 66,
  [67] = 67,
  [68] = 68,
  [69] = 69,
  [70] = 70,
  [71] = 71,
  [72] = 72,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(43);
      ADVANCE_MAP(
        '&', 50,
        '(', 63,
        ')', 64,
        ':', 66,
        '<', 47,
        '=', 46,
        '>', 48,
        '?', 7,
        'a', 30,
        'e', 37,
        'f', 35,
        'i', 20,
        'p', 26,
        'v', 8,
        '|', 49,
      );
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(40);
      END_STATE();
    case 1:
      if (lookahead == ' ') ADVANCE(31);
      END_STATE();
    case 2:
      if (lookahead == ' ') ADVANCE(19);
      END_STATE();
    case 3:
      if (lookahead == '$') ADVANCE(39);
      if (lookahead == '(') ADVANCE(63);
      if (lookahead == ':') ADVANCE(65);
      if (lookahead == '<') ADVANCE(47);
      if (lookahead == '=') ADVANCE(46);
      if (lookahead == '>') ADVANCE(48);
      if (lookahead == 'f') ADVANCE(56);
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(3);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 4:
      if (lookahead == '$') ADVANCE(39);
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(4);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 5:
      if (lookahead == ':') ADVANCE(58);
      END_STATE();
    case 6:
      if (lookahead == '?') ADVANCE(45);
      END_STATE();
    case 7:
      if (lookahead == '?') ADVANCE(6);
      END_STATE();
    case 8:
      if (lookahead == 'a') ADVANCE(17);
      END_STATE();
    case 9:
      if (lookahead == 'a') ADVANCE(18);
      END_STATE();
    case 10:
      if (lookahead == 'a') ADVANCE(33);
      END_STATE();
    case 11:
      if (lookahead == 'c') ADVANCE(1);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(62);
      END_STATE();
    case 13:
      if (lookahead == 'e') ADVANCE(2);
      END_STATE();
    case 14:
      if (lookahead == 'e') ADVANCE(29);
      END_STATE();
    case 15:
      if (lookahead == 'i') ADVANCE(36);
      END_STATE();
    case 16:
      if (lookahead == 'i') ADVANCE(34);
      END_STATE();
    case 17:
      if (lookahead == 'l') ADVANCE(59);
      if (lookahead == 'r') ADVANCE(60);
      END_STATE();
    case 18:
      if (lookahead == 'l') ADVANCE(51);
      END_STATE();
    case 19:
      if (lookahead == 'l') ADVANCE(16);
      END_STATE();
    case 20:
      if (lookahead == 'm') ADVANCE(23);
      END_STATE();
    case 21:
      if (lookahead == 'n') ADVANCE(11);
      END_STATE();
    case 22:
      if (lookahead == 'o') ADVANCE(28);
      END_STATE();
    case 23:
      if (lookahead == 'p') ADVANCE(22);
      END_STATE();
    case 24:
      if (lookahead == 'p') ADVANCE(27);
      END_STATE();
    case 25:
      if (lookahead == 'p') ADVANCE(13);
      END_STATE();
    case 26:
      if (lookahead == 'r') ADVANCE(15);
      END_STATE();
    case 27:
      if (lookahead == 'r') ADVANCE(52);
      END_STATE();
    case 28:
      if (lookahead == 'r') ADVANCE(32);
      END_STATE();
    case 29:
      if (lookahead == 'r') ADVANCE(9);
      END_STATE();
    case 30:
      if (lookahead == 's') ADVANCE(44);
      END_STATE();
    case 31:
      if (lookahead == 't') ADVANCE(38);
      END_STATE();
    case 32:
      if (lookahead == 't') ADVANCE(61);
      END_STATE();
    case 33:
      if (lookahead == 't') ADVANCE(12);
      END_STATE();
    case 34:
      if (lookahead == 't') ADVANCE(14);
      END_STATE();
    case 35:
      if (lookahead == 'u') ADVANCE(21);
      END_STATE();
    case 36:
      if (lookahead == 'v') ADVANCE(10);
      END_STATE();
    case 37:
      if (lookahead == 'x') ADVANCE(24);
      END_STATE();
    case 38:
      if (lookahead == 'y') ADVANCE(25);
      END_STATE();
    case 39:
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 40:
      if (eof) ADVANCE(43);
      ADVANCE_MAP(
        '&', 50,
        '(', 63,
        ')', 64,
        ':', 65,
        '<', 47,
        '=', 46,
        '>', 48,
        '?', 7,
        'a', 30,
        'e', 37,
        'f', 35,
        'i', 20,
        'p', 26,
        'v', 8,
        '|', 49,
      );
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(40);
      END_STATE();
    case 41:
      if (eof) ADVANCE(43);
      ADVANCE_MAP(
        '&', 50,
        ')', 64,
        ':', 5,
        '=', 46,
        '>', 48,
        'a', 30,
        'i', 20,
        'p', 26,
        'v', 8,
        '|', 49,
      );
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(42);
      END_STATE();
    case 42:
      if (eof) ADVANCE(43);
      ADVANCE_MAP(
        '&', 50,
        ')', 64,
        '=', 46,
        '>', 48,
        'a', 30,
        'i', 20,
        'p', 26,
        'v', 8,
        '|', 49,
      );
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(42);
      END_STATE();
    case 43:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 44:
      ACCEPT_TOKEN(anon_sym_as);
      END_STATE();
    case 45:
      ACCEPT_TOKEN(sym_unknown_expression);
      END_STATE();
    case 46:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 47:
      ACCEPT_TOKEN(anon_sym_LT);
      END_STATE();
    case 48:
      ACCEPT_TOKEN(anon_sym_GT);
      END_STATE();
    case 49:
      ACCEPT_TOKEN(anon_sym_PIPE);
      END_STATE();
    case 50:
      ACCEPT_TOKEN(anon_sym_AMP);
      END_STATE();
    case 51:
      ACCEPT_TOKEN(sym_function_type_literal);
      END_STATE();
    case 52:
      ACCEPT_TOKEN(sym_expression);
      END_STATE();
    case 53:
      ACCEPT_TOKEN(sym_name_identifier);
      if (lookahead == ' ') ADVANCE(31);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 54:
      ACCEPT_TOKEN(sym_name_identifier);
      if (lookahead == 'c') ADVANCE(53);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 55:
      ACCEPT_TOKEN(sym_name_identifier);
      if (lookahead == 'n') ADVANCE(54);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 56:
      ACCEPT_TOKEN(sym_name_identifier);
      if (lookahead == 'u') ADVANCE(55);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 57:
      ACCEPT_TOKEN(sym_name_identifier);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(57);
      END_STATE();
    case 58:
      ACCEPT_TOKEN(anon_sym_COLON_COLON);
      END_STATE();
    case 59:
      ACCEPT_TOKEN(sym_VAL_KEYWORD);
      END_STATE();
    case 60:
      ACCEPT_TOKEN(sym_VAR_KEYWORD);
      END_STATE();
    case 61:
      ACCEPT_TOKEN(sym_IMPORT_KEYWORD);
      END_STATE();
    case 62:
      ACCEPT_TOKEN(sym_PRIVATE_KEYWORD);
      END_STATE();
    case 63:
      ACCEPT_TOKEN(sym_OPEN_PAREN);
      END_STATE();
    case 64:
      ACCEPT_TOKEN(sym_CLOSE_PAREN);
      END_STATE();
    case 65:
      ACCEPT_TOKEN(sym_COLON);
      END_STATE();
    case 66:
      ACCEPT_TOKEN(sym_COLON);
      if (lookahead == ':') ADVANCE(58);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 41},
  [3] = {.lex_state = 41},
  [4] = {.lex_state = 41},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 0},
  [7] = {.lex_state = 41},
  [8] = {.lex_state = 3},
  [9] = {.lex_state = 3},
  [10] = {.lex_state = 0},
  [11] = {.lex_state = 3},
  [12] = {.lex_state = 0},
  [13] = {.lex_state = 0},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 0},
  [16] = {.lex_state = 3},
  [17] = {.lex_state = 3},
  [18] = {.lex_state = 3},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 3},
  [21] = {.lex_state = 3},
  [22] = {.lex_state = 0},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 0},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 0},
  [27] = {.lex_state = 0},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 0},
  [30] = {.lex_state = 0},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 3},
  [33] = {.lex_state = 0},
  [34] = {.lex_state = 3},
  [35] = {.lex_state = 0},
  [36] = {.lex_state = 0},
  [37] = {.lex_state = 0},
  [38] = {.lex_state = 0},
  [39] = {.lex_state = 0},
  [40] = {.lex_state = 0},
  [41] = {.lex_state = 0},
  [42] = {.lex_state = 0},
  [43] = {.lex_state = 0},
  [44] = {.lex_state = 0},
  [45] = {.lex_state = 0},
  [46] = {.lex_state = 0},
  [47] = {.lex_state = 0},
  [48] = {.lex_state = 3},
  [49] = {.lex_state = 3},
  [50] = {.lex_state = 0},
  [51] = {.lex_state = 3},
  [52] = {.lex_state = 0},
  [53] = {.lex_state = 0},
  [54] = {.lex_state = 4},
  [55] = {.lex_state = 0},
  [56] = {.lex_state = 0},
  [57] = {.lex_state = 0},
  [58] = {.lex_state = 3},
  [59] = {.lex_state = 0},
  [60] = {.lex_state = 0},
  [61] = {.lex_state = 0},
  [62] = {.lex_state = 4},
  [63] = {.lex_state = 0},
  [64] = {.lex_state = 0},
  [65] = {.lex_state = 4},
  [66] = {.lex_state = 4},
  [67] = {.lex_state = 4},
  [68] = {.lex_state = 0},
  [69] = {.lex_state = 0},
  [70] = {.lex_state = 0},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_as] = ACTIONS(1),
    [sym_unknown_expression] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_LT] = ACTIONS(1),
    [anon_sym_GT] = ACTIONS(1),
    [anon_sym_PIPE] = ACTIONS(1),
    [anon_sym_AMP] = ACTIONS(1),
    [sym_function_type_literal] = ACTIONS(1),
    [sym_expression] = ACTIONS(1),
    [anon_sym_COLON_COLON] = ACTIONS(1),
    [sym_VAL_KEYWORD] = ACTIONS(1),
    [sym_VAR_KEYWORD] = ACTIONS(1),
    [sym_IMPORT_KEYWORD] = ACTIONS(1),
    [sym_PRIVATE_KEYWORD] = ACTIONS(1),
    [sym_OPEN_PAREN] = ACTIONS(1),
    [sym_CLOSE_PAREN] = ACTIONS(1),
    [sym_COLON] = ACTIONS(1),
  },
  [1] = {
    [sym_document] = STATE(61),
    [sym_val_directive] = STATE(5),
    [sym_var_directive] = STATE(5),
    [sym_import_directive] = STATE(5),
    [sym_private_modifier] = STATE(47),
    [sym_val_declaration] = STATE(43),
    [sym_var_declaration] = STATE(27),
    [aux_sym_directives_repeat1] = STATE(5),
    [sym_VAL_KEYWORD] = ACTIONS(3),
    [sym_VAR_KEYWORD] = ACTIONS(5),
    [sym_IMPORT_KEYWORD] = ACTIONS(7),
    [sym_PRIVATE_KEYWORD] = ACTIONS(9),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 3,
    ACTIONS(13), 1,
      anon_sym_COLON_COLON,
    STATE(3), 1,
      aux_sym_qname_repeat1,
    ACTIONS(11), 11,
      ts_builtin_sym_end,
      anon_sym_as,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
      sym_CLOSE_PAREN,
  [20] = 3,
    ACTIONS(13), 1,
      anon_sym_COLON_COLON,
    STATE(4), 1,
      aux_sym_qname_repeat1,
    ACTIONS(15), 11,
      ts_builtin_sym_end,
      anon_sym_as,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
      sym_CLOSE_PAREN,
  [40] = 3,
    ACTIONS(19), 1,
      anon_sym_COLON_COLON,
    STATE(4), 1,
      aux_sym_qname_repeat1,
    ACTIONS(17), 11,
      ts_builtin_sym_end,
      anon_sym_as,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
      sym_CLOSE_PAREN,
  [60] = 9,
    ACTIONS(3), 1,
      sym_VAL_KEYWORD,
    ACTIONS(5), 1,
      sym_VAR_KEYWORD,
    ACTIONS(7), 1,
      sym_IMPORT_KEYWORD,
    ACTIONS(9), 1,
      sym_PRIVATE_KEYWORD,
    ACTIONS(22), 1,
      ts_builtin_sym_end,
    STATE(27), 1,
      sym_var_declaration,
    STATE(43), 1,
      sym_val_declaration,
    STATE(47), 1,
      sym_private_modifier,
    STATE(6), 4,
      sym_val_directive,
      sym_var_directive,
      sym_import_directive,
      aux_sym_directives_repeat1,
  [91] = 9,
    ACTIONS(24), 1,
      ts_builtin_sym_end,
    ACTIONS(26), 1,
      sym_VAL_KEYWORD,
    ACTIONS(29), 1,
      sym_VAR_KEYWORD,
    ACTIONS(32), 1,
      sym_IMPORT_KEYWORD,
    ACTIONS(35), 1,
      sym_PRIVATE_KEYWORD,
    STATE(27), 1,
      sym_var_declaration,
    STATE(43), 1,
      sym_val_declaration,
    STATE(47), 1,
      sym_private_modifier,
    STATE(6), 4,
      sym_val_directive,
      sym_var_directive,
      sym_import_directive,
      aux_sym_directives_repeat1,
  [122] = 1,
    ACTIONS(17), 12,
      ts_builtin_sym_end,
      anon_sym_as,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      anon_sym_COLON_COLON,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
      sym_CLOSE_PAREN,
  [137] = 8,
    ACTIONS(38), 1,
      anon_sym_LT,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(17), 1,
      sym_function_effect,
    STATE(28), 1,
      sym_qname,
    STATE(69), 1,
      sym_type,
  [162] = 8,
    ACTIONS(38), 1,
      anon_sym_LT,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(18), 1,
      sym_function_effect,
    STATE(28), 1,
      sym_qname,
    STATE(68), 1,
      sym_type,
  [187] = 5,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(13), 1,
      aux_sym_intersection_type_repeat1,
    STATE(33), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(46), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [205] = 7,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    ACTIONS(52), 1,
      anon_sym_GT,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(70), 1,
      sym_type,
  [227] = 5,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(14), 1,
      aux_sym_intersection_type_repeat1,
    STATE(42), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(54), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [245] = 5,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(19), 1,
      aux_sym_intersection_type_repeat1,
    STATE(38), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(56), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [263] = 5,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(19), 1,
      aux_sym_intersection_type_repeat1,
    STATE(46), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(58), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [281] = 2,
    ACTIONS(62), 1,
      anon_sym_as,
    ACTIONS(60), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [292] = 6,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(71), 1,
      sym_type,
  [311] = 6,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(72), 1,
      sym_type,
  [330] = 6,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(60), 1,
      sym_type,
  [349] = 3,
    ACTIONS(66), 1,
      anon_sym_AMP,
    STATE(19), 1,
      aux_sym_intersection_type_repeat1,
    ACTIONS(64), 4,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      sym_CLOSE_PAREN,
  [362] = 6,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(64), 1,
      sym_type,
  [381] = 6,
    ACTIONS(40), 1,
      sym_function_type_literal,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(44), 1,
      sym_OPEN_PAREN,
    STATE(10), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
    STATE(63), 1,
      sym_type,
  [400] = 3,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(23), 1,
      aux_sym_intersection_type_repeat1,
    ACTIONS(69), 4,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      sym_CLOSE_PAREN,
  [413] = 3,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(19), 1,
      aux_sym_intersection_type_repeat1,
    ACTIONS(71), 4,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      sym_CLOSE_PAREN,
  [426] = 3,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(25), 1,
      aux_sym_intersection_type_repeat1,
    ACTIONS(73), 4,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      sym_CLOSE_PAREN,
  [439] = 3,
    ACTIONS(50), 1,
      anon_sym_AMP,
    STATE(19), 1,
      aux_sym_intersection_type_repeat1,
    ACTIONS(75), 4,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      sym_CLOSE_PAREN,
  [452] = 1,
    ACTIONS(77), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [460] = 1,
    ACTIONS(79), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [468] = 1,
    ACTIONS(81), 5,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_CLOSE_PAREN,
  [476] = 1,
    ACTIONS(83), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [484] = 1,
    ACTIONS(85), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [492] = 1,
    ACTIONS(87), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [500] = 5,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(89), 1,
      sym_function_type_literal,
    ACTIONS(91), 1,
      sym_OPEN_PAREN,
    STATE(22), 1,
      sym_reference,
    STATE(28), 1,
      sym_qname,
  [516] = 3,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    STATE(37), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(56), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [528] = 5,
    ACTIONS(42), 1,
      sym_name_identifier,
    ACTIONS(93), 1,
      sym_function_type_literal,
    ACTIONS(95), 1,
      sym_OPEN_PAREN,
    STATE(28), 1,
      sym_qname,
    STATE(36), 1,
      sym_reference,
  [544] = 1,
    ACTIONS(97), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [552] = 1,
    ACTIONS(64), 5,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_CLOSE_PAREN,
  [560] = 3,
    ACTIONS(99), 1,
      anon_sym_PIPE,
    STATE(37), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(69), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [572] = 3,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    STATE(37), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(54), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [584] = 1,
    ACTIONS(102), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [592] = 1,
    ACTIONS(104), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [600] = 1,
    ACTIONS(106), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [608] = 3,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    STATE(37), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(58), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [620] = 1,
    ACTIONS(108), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [628] = 1,
    ACTIONS(110), 5,
      ts_builtin_sym_end,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
      sym_IMPORT_KEYWORD,
      sym_PRIVATE_KEYWORD,
  [636] = 1,
    ACTIONS(112), 5,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_PIPE,
      anon_sym_AMP,
      sym_CLOSE_PAREN,
  [644] = 3,
    ACTIONS(48), 1,
      anon_sym_PIPE,
    STATE(37), 1,
      aux_sym_union_type_repeat1,
    ACTIONS(114), 3,
      anon_sym_EQ,
      anon_sym_GT,
      sym_CLOSE_PAREN,
  [656] = 4,
    ACTIONS(3), 1,
      sym_VAL_KEYWORD,
    ACTIONS(5), 1,
      sym_VAR_KEYWORD,
    STATE(30), 1,
      sym_val_declaration,
    STATE(35), 1,
      sym_var_declaration,
  [669] = 2,
    ACTIONS(118), 1,
      sym_name_identifier,
    ACTIONS(116), 2,
      sym_function_type_literal,
      sym_OPEN_PAREN,
  [677] = 2,
    ACTIONS(122), 1,
      sym_name_identifier,
    ACTIONS(120), 2,
      sym_function_type_literal,
      sym_OPEN_PAREN,
  [685] = 1,
    ACTIONS(124), 2,
      sym_unknown_expression,
      sym_expression,
  [690] = 2,
    ACTIONS(126), 1,
      anon_sym_EQ,
    ACTIONS(128), 1,
      sym_COLON,
  [697] = 1,
    ACTIONS(130), 2,
      sym_unknown_expression,
      sym_expression,
  [702] = 1,
    ACTIONS(132), 2,
      sym_unknown_expression,
      sym_expression,
  [707] = 2,
    ACTIONS(134), 1,
      sym_name_identifier,
    STATE(15), 1,
      sym_qname,
  [714] = 1,
    ACTIONS(136), 2,
      sym_unknown_expression,
      sym_expression,
  [719] = 1,
    ACTIONS(138), 2,
      sym_VAL_KEYWORD,
      sym_VAR_KEYWORD,
  [724] = 1,
    ACTIONS(140), 2,
      sym_unknown_expression,
      sym_expression,
  [729] = 2,
    ACTIONS(142), 1,
      anon_sym_EQ,
    ACTIONS(144), 1,
      sym_COLON,
  [736] = 1,
    ACTIONS(146), 2,
      sym_unknown_expression,
      sym_expression,
  [741] = 1,
    ACTIONS(148), 1,
      anon_sym_EQ,
  [745] = 1,
    ACTIONS(150), 1,
      ts_builtin_sym_end,
  [749] = 1,
    ACTIONS(152), 1,
      sym_name_identifier,
  [753] = 1,
    ACTIONS(154), 1,
      sym_CLOSE_PAREN,
  [757] = 1,
    ACTIONS(156), 1,
      sym_CLOSE_PAREN,
  [761] = 1,
    ACTIONS(158), 1,
      sym_name_identifier,
  [765] = 1,
    ACTIONS(160), 1,
      sym_name_identifier,
  [769] = 1,
    ACTIONS(162), 1,
      sym_name_identifier,
  [773] = 1,
    ACTIONS(164), 1,
      anon_sym_EQ,
  [777] = 1,
    ACTIONS(166), 1,
      anon_sym_EQ,
  [781] = 1,
    ACTIONS(168), 1,
      anon_sym_GT,
  [785] = 1,
    ACTIONS(170), 1,
      sym_CLOSE_PAREN,
  [789] = 1,
    ACTIONS(172), 1,
      anon_sym_EQ,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 20,
  [SMALL_STATE(4)] = 40,
  [SMALL_STATE(5)] = 60,
  [SMALL_STATE(6)] = 91,
  [SMALL_STATE(7)] = 122,
  [SMALL_STATE(8)] = 137,
  [SMALL_STATE(9)] = 162,
  [SMALL_STATE(10)] = 187,
  [SMALL_STATE(11)] = 205,
  [SMALL_STATE(12)] = 227,
  [SMALL_STATE(13)] = 245,
  [SMALL_STATE(14)] = 263,
  [SMALL_STATE(15)] = 281,
  [SMALL_STATE(16)] = 292,
  [SMALL_STATE(17)] = 311,
  [SMALL_STATE(18)] = 330,
  [SMALL_STATE(19)] = 349,
  [SMALL_STATE(20)] = 362,
  [SMALL_STATE(21)] = 381,
  [SMALL_STATE(22)] = 400,
  [SMALL_STATE(23)] = 413,
  [SMALL_STATE(24)] = 426,
  [SMALL_STATE(25)] = 439,
  [SMALL_STATE(26)] = 452,
  [SMALL_STATE(27)] = 460,
  [SMALL_STATE(28)] = 468,
  [SMALL_STATE(29)] = 476,
  [SMALL_STATE(30)] = 484,
  [SMALL_STATE(31)] = 492,
  [SMALL_STATE(32)] = 500,
  [SMALL_STATE(33)] = 516,
  [SMALL_STATE(34)] = 528,
  [SMALL_STATE(35)] = 544,
  [SMALL_STATE(36)] = 552,
  [SMALL_STATE(37)] = 560,
  [SMALL_STATE(38)] = 572,
  [SMALL_STATE(39)] = 584,
  [SMALL_STATE(40)] = 592,
  [SMALL_STATE(41)] = 600,
  [SMALL_STATE(42)] = 608,
  [SMALL_STATE(43)] = 620,
  [SMALL_STATE(44)] = 628,
  [SMALL_STATE(45)] = 636,
  [SMALL_STATE(46)] = 644,
  [SMALL_STATE(47)] = 656,
  [SMALL_STATE(48)] = 669,
  [SMALL_STATE(49)] = 677,
  [SMALL_STATE(50)] = 685,
  [SMALL_STATE(51)] = 690,
  [SMALL_STATE(52)] = 697,
  [SMALL_STATE(53)] = 702,
  [SMALL_STATE(54)] = 707,
  [SMALL_STATE(55)] = 714,
  [SMALL_STATE(56)] = 719,
  [SMALL_STATE(57)] = 724,
  [SMALL_STATE(58)] = 729,
  [SMALL_STATE(59)] = 736,
  [SMALL_STATE(60)] = 741,
  [SMALL_STATE(61)] = 745,
  [SMALL_STATE(62)] = 749,
  [SMALL_STATE(63)] = 753,
  [SMALL_STATE(64)] = 757,
  [SMALL_STATE(65)] = 761,
  [SMALL_STATE(66)] = 765,
  [SMALL_STATE(67)] = 769,
  [SMALL_STATE(68)] = 773,
  [SMALL_STATE(69)] = 777,
  [SMALL_STATE(70)] = 781,
  [SMALL_STATE(71)] = 785,
  [SMALL_STATE(72)] = 789,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, SHIFT(66),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [11] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_qname, 1, 0, 0),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [15] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_qname, 2, 0, 0),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_qname_repeat1, 2, 0, 0),
  [19] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_qname_repeat1, 2, 0, 0), SHIFT_REPEAT(62),
  [22] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document, 1, 0, 0),
  [24] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_directives_repeat1, 2, 0, 0),
  [26] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directives_repeat1, 2, 0, 0), SHIFT_REPEAT(66),
  [29] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directives_repeat1, 2, 0, 0), SHIFT_REPEAT(65),
  [32] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directives_repeat1, 2, 0, 0), SHIFT_REPEAT(54),
  [35] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directives_repeat1, 2, 0, 0), SHIFT_REPEAT(56),
  [38] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [40] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [42] = {.entry = {.count = 1, .reusable = false}}, SHIFT(2),
  [44] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [46] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_type, 1, 0, 0),
  [48] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [50] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [52] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [54] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_type, 3, 0, 0),
  [56] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_type, 2, 0, 0),
  [58] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_type, 4, 0, 0),
  [60] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_import_directive, 2, 0, 0),
  [62] = {.entry = {.count = 1, .reusable = true}}, SHIFT(67),
  [64] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_intersection_type_repeat1, 2, 0, 0),
  [66] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_intersection_type_repeat1, 2, 0, 0), SHIFT_REPEAT(34),
  [69] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_union_type_repeat1, 2, 0, 0),
  [71] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_union_type_repeat1, 3, 0, 0),
  [73] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_union_type_repeat1, 4, 0, 0),
  [75] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_union_type_repeat1, 5, 0, 0),
  [77] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_val_declaration, 7, 0, 0),
  [79] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_var_directive, 1, 0, 0),
  [81] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_reference, 1, 0, 0),
  [83] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_var_declaration, 4, 0, 0),
  [85] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_val_directive, 2, 0, 0),
  [87] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_import_directive, 4, 0, 0),
  [89] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [91] = {.entry = {.count = 1, .reusable = true}}, SHIFT(21),
  [93] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [95] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [97] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_var_directive, 2, 0, 0),
  [99] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_union_type_repeat1, 2, 0, 0), SHIFT_REPEAT(32),
  [102] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_var_declaration, 7, 0, 0),
  [104] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_val_declaration, 6, 0, 0),
  [106] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_var_declaration, 6, 0, 0),
  [108] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_val_directive, 1, 0, 0),
  [110] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_val_declaration, 4, 0, 0),
  [112] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_intersection_type_repeat1, 4, 0, 0),
  [114] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_type, 5, 0, 0),
  [116] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_effect, 2, 0, 0),
  [118] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_effect, 2, 0, 0),
  [120] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_effect, 3, 0, 0),
  [122] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_effect, 3, 0, 0),
  [124] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [126] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [128] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [130] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [132] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [134] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [136] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [138] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_private_modifier, 1, 0, 0),
  [140] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [142] = {.entry = {.count = 1, .reusable = true}}, SHIFT(50),
  [144] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [146] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [148] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [150] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [152] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [154] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [156] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [158] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [160] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [162] = {.entry = {.count = 1, .reusable = true}}, SHIFT(31),
  [164] = {.entry = {.count = 1, .reusable = true}}, SHIFT(53),
  [166] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [168] = {.entry = {.count = 1, .reusable = true}}, SHIFT(49),
  [170] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [172] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef TREE_SITTER_HIDE_SYMBOLS
#define TS_PUBLIC
#elif defined(_WIN32)
#define TS_PUBLIC __declspec(dllexport)
#else
#define TS_PUBLIC __attribute__((visibility("default")))
#endif

TS_PUBLIC const TSLanguage *tree_sitter_lys(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
