import XCTest
import SwiftTreeSitter
import TreeSitterLys

final class TreeSitterLysTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lys())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lys grammar")
    }
}
