# Contributing to ChatApp

Thank you for your interest in contributing to ChatApp! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Keep discussions on-topic

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Include details**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment (OS, Node version, browser)

### Suggesting Enhancements

1. **Check if the feature has been requested** before
2. **Describe the use case** clearly
3. **Explain why** this enhancement would be useful
4. **Provide examples** if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Follow the coding standards** (see below)
5. **Write or update tests**
6. **Update documentation**
7. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
8. **Push to your fork**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

## Development Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Teste.git
   cd Teste
   ```

2. **Install dependencies**:
   ```bash
   ./setup.sh  # or setup.bat on Windows
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

## Coding Standards

### General
- Use **TypeScript** for all new code
- Follow **existing code style**
- Write **clear, self-documenting code**
- Add **comments for complex logic**
- Keep functions **small and focused**

### TypeScript
- Enable **strict mode**
- Avoid using **`any`** type
- Define proper **interfaces** for data structures
- Use **meaningful variable names**

### React
- Use **functional components** with hooks
- Follow **React best practices**
- Keep components **small and reusable**
- Use **proper prop types**
- Handle **loading and error states**

### Node.js/Express
- Use **async/await** for asynchronous code
- Handle **errors properly**
- Validate **all user inputs**
- Use **middleware** for common functionality
- Follow **RESTful conventions**

### CSS/Tailwind
- Use **Tailwind utility classes** when possible
- Keep **custom CSS minimal**
- Follow **mobile-first** approach
- Ensure **accessibility**

## Testing

### Running Tests
```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

### Writing Tests
- Write tests for **new features**
- Update tests for **changed functionality**
- Ensure **good coverage**
- Test **edge cases**

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
git commit -m "feat(chat): add message reactions"
git commit -m "fix(auth): prevent duplicate user registration"
git commit -m "docs(readme): update installation instructions"
```

## Project Structure

```
/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and Socket services
│   │   ├── store/         # State management
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
│
├── server/                # Backend Node.js app
│   └── src/
│       ├── config/       # Configuration files
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Express middleware
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       └── socket/       # Socket.io handlers
│
└── docs/                 # Additional documentation
```

## Key Areas for Contribution

### High Priority
- [ ] Unit tests for backend controllers
- [ ] Integration tests for API endpoints
- [ ] E2E tests for frontend flows
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Mobile responsiveness enhancements

### Features
- [ ] Direct messaging (DMs)
- [ ] File/image sharing
- [ ] Message search
- [ ] User profiles and settings
- [ ] Server roles and permissions
- [ ] Message notifications
- [ ] Theme customization
- [ ] Multi-language support
- [ ] Screen sharing in calls
- [ ] Group video calls

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Component documentation (Storybook)
- [ ] Architecture diagrams
- [ ] Deployment guides
- [ ] Video tutorials

## Review Process

1. **Automated checks** run on all PRs:
   - TypeScript compilation
   - ESLint
   - Tests
   - Build verification

2. **Code review** by maintainers:
   - Code quality
   - Tests
   - Documentation
   - Breaking changes

3. **Testing** by reviewers:
   - Functionality
   - UI/UX
   - Performance
   - Security

## Questions?

- **GitHub Discussions**: For general questions
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in the Contributors section of README
- Mentioned in release notes
- Given credit in commit history

Thank you for contributing to ChatApp! 🎉
