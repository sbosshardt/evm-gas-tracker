# EVM Gas Tracker

A real-time gas price tracker for Ethereum Virtual Machine (EVM) compatible networks. Monitor gas costs across different networks and estimate transaction costs for common operations.

## Features

- Real-time gas price updates via WebSocket
- Support for multiple EVM networks
- Cost estimation for common operations (token transfers, NFT minting, etc.)
- Multi-currency support (USD, EUR, GBP, etc.)
- Modern, responsive UI built with Next.js and Tailwind CSS
- Dark/Light theme support

## Live Demo

https://evmgastracker.com

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/sbosshardt/evm-gas-tracker.git
cd evm-gas-tracker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
PORT=3000
WS_PORT=3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

## Production Deployment

1. Build the application
```bash
npm run build
# or
yarn build
```

2. Start the production server
```bash
npm run start
# or
yarn start
```

## Technology Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Socket.IO](https://socket.io/) - Real-time WebSocket communication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Samuel Bosshardt ([@sbosshardt](https://github.com/sbosshardt))
With assistance from GPT 4o & claude-3.5-sonnet