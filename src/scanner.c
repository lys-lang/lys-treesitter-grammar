#include <assert.h>
#include <string.h>
#include <limits.h>

#include "tree_sitter/parser.h"

typedef enum _LysExtTokenType {
    kNewLineChar,       // => $.newline

    kLineComment,       // => $.line_comment
    kBlockComment,      // => $.block_comment

    // See `tree_sitter_lys_external_scanner_scan` for more info
    kErrorBacktrackSentinel,    // => $._err_sentinel
} LysExtTokenType;

#define T_LINE_COMMENT  "//"
#define T_BLOCK_COMMENT "/" "*"   // preprocessor freaks out if the strings are merged... sigh

static const char kCommentFeedCharSet[] = { '/', '*', 0 };

enum {
    // Returned by the `lys_drop_*` functions if EOF was encountered before
    // the predicate could come true
    kEndOfStream = INT32_MAX,
};

static bool lys_try_scan_newline(TSLexer *lexer, const bool *valid_symbols);
static bool lys_try_scan_comment(TSLexer *lexer, const bool *valid_symbols);

static int32_t lys_drop_chars(TSLexer *lexer, unsigned n);
static int32_t lys_drop_until_oneof(TSLexer *lexer, const char *charset, size_t set_size);
static bool lys_eat_char(TSLexer *lexer, int32_t ch);

static bool lys_eat_line(TSLexer *lexer);
static bool lys_eat_block(TSLexer *lexer, int comment_level);

static const char *charset_member(int32_t ch, const char *charset, size_t set_size);
static bool is_charset_member(int32_t ch, const char *charset, size_t set_size);

bool tree_sitter_lys_external_scanner_scan(void *scanner, TSLexer *lexer, const bool *valid_symbols)
{
    bool is_error_state = valid_symbols[kErrorBacktrackSentinel];
    if(is_error_state) {
        // From the TreeSitter docs:
        //   "During error recovery, [the] first step is to call [the scan function] with all
        //    tokens marked as valid. [It] should detect and handle this"
        // ...it then continues:
        //   "If you would rather not handle [error recovery], the way to "opt-out" [...] is
        //    to return false when `valid_symbols` contains the error sentinel."
        return false;
    }

    bool scanned_newline = lys_try_scan_newline(lexer, valid_symbols);
    if(scanned_newline) return true;

    bool scanned_comment = lys_try_scan_comment(lexer, valid_symbols);
    if(scanned_comment) return true;

    // Didn't match any of the `LysExtTokenType`s
    return false;
}

void *tree_sitter_lys_external_scanner_create()
{
    // We don't carry any auxiliary (intra-token) state
    return NULL;
}

void tree_sitter_lys_external_scanner_destroy(void *scanner)
{
    // No-op (there's no auxiliary state to destroy)
}

unsigned tree_sitter_lys_external_scanner_serialize(void *scanner, void *buf)
{
    return 0;
}

void tree_sitter_lys_external_scanner_deserialize(void *scanner, void *buf, unsigned len)
{
    // `tree_sitter_lys_external_scanner_serialize` stores nothing,
    // so this must be a no-op too...
}

static bool lys_try_scan_newline(TSLexer *lexer, const bool *valid_symbols)
{
    bool maybe_newline = valid_symbols[kNewLineChar];
    if(!maybe_newline) return false;

    bool ate_newline = lys_eat_char(lexer, '\n');
    if(ate_newline) {
        lexer->result_symbol = kNewLineChar;
    }

    return ate_newline;
}

static bool lys_try_scan_comment(TSLexer *lexer, const bool *syms)
{
    bool maybe_comment_start = (syms[kLineComment] || syms[kBlockComment]);
    if(!maybe_comment_start) return false;

    bool peeked_comment = (lexer->lookahead == '/');
    if(!peeked_comment) return false;

    lys_drop_chars(lexer, 1);
    switch(lexer->lookahead) {
    case '/': return lys_eat_line(lexer);
    case '*': return lys_eat_block(lexer, 1);
    }

    return false;
}

static int32_t lys_drop_chars(TSLexer *lexer, unsigned n)
{
    assert(n > 0);

    int32_t ch = -1;
    do {
        if(lexer->eof(lexer)) return kEndOfStream;

        ch = lexer->lookahead;
        lexer->advance(lexer, false);
    } while(--n > 0);

    return ch;
}

static const char *charset_member(int32_t ch, const char *charset, size_t set_size)
{
    assert(set_size > 0 && charset[set_size] == '\0');
    if(ch < 0 || ch > CHAR_MAX) {
        // `memchr()` casts it's argument to a `char` (truncates it),
        //  so ensure we won't get an erroneous result.
        return false;
    }

    return memchr(charset, ch, set_size);
}

static bool is_charset_member(int32_t ch, const char *charset, size_t set_size)
{
    return (charset_member(ch, charset, set_size) != NULL);
}

static int32_t lys_drop_until_oneof(TSLexer *lexer, const char *charset, size_t set_size)
{
    while(!lexer->eof(lexer)) {
        const char *match = charset_member(lexer->lookahead, charset, set_size);
        lexer->advance(lexer, false);

        if(match != NULL) {
            return *match;
        }
    }

    return kEndOfStream;
}

static bool lys_eat_char(TSLexer *lexer, int32_t ch)
{
    bool peeked_ch = (lexer->lookahead == ch);
    if(peeked_ch) {
        lexer->advance(lexer, true);
    }

    return peeked_ch;
}

static bool lys_eat_block(TSLexer *lexer, int comment_level)
{
    int feed_char_column = lexer->get_column(lexer);
    while(!lexer->eof(lexer)) {
        int32_t feed = lys_drop_until_oneof(lexer,
                                            kCommentFeedCharSet,
                                            sizeof(kCommentFeedCharSet)-1);

        if(feed == kEndOfStream) return false;

        // @edge-case: if we were to unconditionally `lys_drop_chars()` here, then
        //             we would've advanced TWICE when parsing `/**/`
        int32_t lookahead = (lexer->get_column(lexer) <= feed_char_column)
            ? lys_drop_chars(lexer, 1)
            : lexer->lookahead;

        feed_char_column = -1;  // XXX: to be perfect we'd have to count every "\n"
                                //      so this'll do... I guess
        switch(feed) {
        case '/':
            if(lookahead != '*') continue;

            // Inside a nested block comment
            lexer->log(lexer, "\t(%d) comment_level++: %d->%d",
                       lexer->get_column(lexer), comment_level, comment_level+1);

            comment_level++;

            continue;

        case '*':
            if(lookahead != '/') continue;

            // Reached a closing `*/` marker...
            lexer->log(lexer, "\t(%d) --comment_level: %d<-%d",
                       lexer->get_column(lexer), comment_level, comment_level-1);

            int new_level = --comment_level;
            if(new_level > 0) continue;

            // ...which was the outermost one
            goto ate_block;

        default:
            assert(false && "`lys_drop_until_oneof` return value not in it's `charset`!?");
        }
    }

ate_block:
    lys_drop_chars(lexer, 1);
    lexer->result_symbol = kBlockComment;

    return true;
}

static bool lys_eat_line(TSLexer *lexer)
{
    // Whether we reach a "\n" or the EOF, it's the end of the comment either way
    lys_drop_until_oneof(lexer, "\n", 1);
    lexer->result_symbol = kLineComment;

    return true;
}
