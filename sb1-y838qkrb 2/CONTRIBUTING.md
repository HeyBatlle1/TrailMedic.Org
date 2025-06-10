# Contributing to TrailMedic.Org

We love your input! We want to make contributing to TrailMedic.Org as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)
Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/HeyBatlle1/trailmedic/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/HeyBatlle1/trailmedic/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

* Use TypeScript for all new code
* 2 spaces for indentation rather than tabs
* You can try running `npm run lint` for style unification

## Emergency-First Development Principles

When contributing to TrailMedic.Org, please keep these principles in mind:

### 🆘 **Emergency Access First**
- Never add authentication barriers to critical features
- Guest mode should have full functionality
- Offline capabilities are essential

### 🔒 **Privacy by Design**
- Local-first data storage
- Optional cloud sync
- Clear data handling policies

### 📱 **Mobile-First Design**
- Touch-friendly interfaces
- Readable in bright sunlight
- Works with gloves

### ⚡ **Performance Critical**
- Fast loading times
- Minimal dependencies
- Efficient GPS tracking

### 🌐 **Accessibility**
- Screen reader compatible
- High contrast modes
- Simple, clear language

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see README.md)
4. Start development server: `npm run dev`
5. Run tests: `npm test`
6. Run linting: `npm run lint`

## Testing Guidelines

- Test emergency scenarios thoroughly
- Verify offline functionality
- Test GPS accuracy and sharing
- Validate AI responses for medical accuracy
- Test on various devices and screen sizes

## Medical Content Guidelines

When contributing medical content:

- **Accuracy is critical** - verify all medical information
- **Emergency-focused** - prioritize immediate life-saving actions
- **Clear instructions** - use simple, actionable language
- **Disclaimer compliance** - maintain appropriate medical disclaimers
- **Professional review** - medical content should be reviewed by qualified professionals

## Code Review Process

1. All code changes require review
2. Medical content requires additional medical professional review
3. Emergency features require thorough testing
4. Performance impact must be considered
5. Accessibility compliance must be verified

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## Emergency Contact

For urgent issues related to medical accuracy or emergency functionality, please contact the maintainers immediately through GitHub issues with the "emergency" label.