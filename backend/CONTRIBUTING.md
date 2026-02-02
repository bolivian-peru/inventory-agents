# Contributing to IFA Etsy Backend

First off, thank you for considering contributing! 🎉

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in [Issues](../../issues)
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (Node version, OS)

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the use case and proposed solution
- Be open to discussion

### Pull Requests

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests (when available): `npm test`
5. Commit with clear messages: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ifa-etsy-backend.git
cd ifa-etsy-backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start PostgreSQL and Redis (Docker)
docker-compose up -d postgres redis

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## Code Style

- Use TypeScript strict mode
- Follow existing patterns in the codebase
- Add JSDoc comments for public functions
- Keep functions small and focused

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding tests
- `chore:` Maintenance tasks

## Questions?

Feel free to open an issue or discussion for any questions!
