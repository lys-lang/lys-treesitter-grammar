// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterLys",
    products: [
        .library(name: "TreeSitterLys", targets: ["TreeSitterLys"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLys",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLysTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLys",
            ],
            path: "bindings/swift/TreeSitterLysTests"
        )
    ],
    cLanguageStandard: .c11
)
