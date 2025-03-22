# PasteIt

PasteIt is a modern, efficient pastebin service that allows users to quickly share code snippets, text, and other content with others.

## Features

- **Simple Sharing**: Easily share text and code snippets with a unique URL
- **Syntax Highlighting**: Support for multiple programming languages
- **Customizable Expiration**: Set how long your pastes should be available
- **Private Pastes**: Option to create password-protected pastes
- **Mobile-Friendly**: Responsive design for all devices

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/bullet-ant/pasteit.git
cd pasteit/ui
```

2. Install dependencies
```bash
npm install
# or
yarn install
```


3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Usage

### Creating a Paste

1. Navigate to the home page
2. Enter your content in the editor
3. Configure settings (expiration, privacy, syntax highlighting)
4. Click "Create Paste"
5. Share the generated URL with others

### API Usage

PasteIt also offers a simple API for programmatic access:

```bash
# Create a new paste
curl -X POST -H "Content-Type: application/json" \
  -d '{"content": "Hello World", "expiration": "1d"}' \
  https://pasteit.example.com/api/paste
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by other pastebin services like Pastebin.com and GitHub Gist
