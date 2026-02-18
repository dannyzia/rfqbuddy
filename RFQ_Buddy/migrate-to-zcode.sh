#!/bin/bash
# ZCode Migration Script
# Moves extension from RFQ_Buddy to separate folder with new name

set -e  # Exit on error

echo "🚀 ZCode Migration Script"
echo "========================="
echo ""

# Configuration
OLD_NAME="zed-kilo-orchestrator"
NEW_NAME="zcode"
SOURCE_DIR="RFQ_Buddy/$OLD_NAME"
TARGET_DIR="../$NEW_NAME"

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Create target directory
echo "📁 Creating new directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Copy files
echo "📋 Copying files..."
cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"

# Navigate to target directory
cd "$TARGET_DIR"

echo "✏️  Renaming references..."

# Update extension.toml
if [ -f "extension.toml" ]; then
    sed -i.bak 's/id = "kilo-orchestrator"/id = "zcode"/' extension.toml
    sed -i.bak 's/name = "Kilo Mode Orchestrator"/name = "ZCode"/' extension.toml
    sed -i.bak 's/description = ".*"/description = "Multi-mode AI orchestration for Zed - switch between specialized AI personas with permissions"/' extension.toml
    sed -i.bak 's|repository = ".*"|repository = "https://github.com/yourusername/zcode"|' extension.toml
    rm extension.toml.bak 2>/dev/null || true
    echo "  ✅ Updated extension.toml"
fi

# Update Cargo.toml
if [ -f "Cargo.toml" ]; then
    sed -i.bak "s/name = \"$OLD_NAME\"/name = \"$NEW_NAME\"/" Cargo.toml
    rm Cargo.toml.bak 2>/dev/null || true
    echo "  ✅ Updated Cargo.toml"
fi

# Update README.md
if [ -f "README.md" ]; then
    sed -i.bak "s/$OLD_NAME/$NEW_NAME/g" README.md
    sed -i.bak 's/Kilo Mode Orchestrator/ZCode/g' README.md
    sed -i.bak 's/# ZCode/# ZCode - AI Mode Orchestrator for Zed/' README.md
    rm README.md.bak 2>/dev/null || true
    echo "  ✅ Updated README.md"
fi

# Update all other markdown files
for file in *.md; do
    if [ -f "$file" ] && [ "$file" != "README.md" ]; then
        sed -i.bak "s/$OLD_NAME/$NEW_NAME/g" "$file" 2>/dev/null || true
        sed -i.bak 's/Kilo Mode Orchestrator/ZCode/g' "$file" 2>/dev/null || true
        rm "${file}.bak" 2>/dev/null || true
    fi
done
echo "  ✅ Updated documentation files"

# Update Rust source files
if [ -d "src" ]; then
    find src -name "*.rs" -type f -exec sed -i.bak "s/$OLD_NAME/$NEW_NAME/g" {} \;
    find src -name "*.rs.bak" -type f -delete 2>/dev/null || true
    echo "  ✅ Updated Rust source files"
fi

# Create examples directory with RFQ_Buddy modes
echo "📚 Creating examples..."
mkdir -p examples
if [ -f "../../RFQ_Buddy/.kilocodemodes" ]; then
    cp "../../RFQ_Buddy/.kilocodemodes" examples/rfq-buddy-modes.yaml
    echo "  ✅ Copied RFQ_Buddy modes as example"
fi

# Create simple example
cat > examples/simple-modes.yaml << 'EOF'
customModes:
  - slug: coder
    name: Coder
    roleDefinition: |
      You are an expert software developer focused on writing clean, efficient code.
    groups:
      - read
      - edit
      - command
    customInstructions: |
      Write clear, well-commented code. Follow best practices.
    source: project

  - slug: reviewer
    name: Code Reviewer
    roleDefinition: |
      You are a senior code reviewer focused on code quality and best practices.
    groups:
      - read
    customInstructions: |
      Provide constructive feedback. Focus on maintainability and security.
    source: project
EOF
echo "  ✅ Created simple example"

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    cat > .gitignore << 'EOF'
# Rust build artifacts
/target/
**/*.rs.bk
*.pdb
Cargo.lock

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Zed extension
*.wasm
EOF
    git add .
    git commit -m "Initial commit: ZCode extension

- Multi-mode AI orchestration for Zed
- Migrated from zed-kilo-orchestrator
- Added examples and documentation"
    echo "  ✅ Git repository initialized"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "📍 New location: $TARGET_DIR"
echo ""
echo "🔧 Next steps:"
echo "1. Build the extension:"
echo "   cd $TARGET_DIR"
echo "   cargo build --release --target wasm32-unknown-unknown"
echo ""
echo "2. Install in Zed:"
echo "   - Open Zed"
echo "   - Run: 'zed: install dev extension'"
echo "   - Select: $(realpath $TARGET_DIR)"
echo ""
echo "3. Clean up RFQ_Buddy:"
echo "   cd ../../RFQ_Buddy"
echo "   rm -rf $OLD_NAME"
echo "   echo '## AI Assistant Setup' >> README.md"
echo "   echo 'This project uses [ZCode](../zcode) for AI mode management.' >> README.md"
echo ""
echo "4. Test in Zed:"
echo "   - Open RFQ_Buddy in Zed"
echo "   - Try: /modes"
echo ""
