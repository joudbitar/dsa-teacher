# Getting Started

New to DSA Lab? This guide will help you get set up and start your first challenge.

## What is DSA Lab?

DSA Lab helps you learn data structures and algorithms by actually building them. Instead of just reading about stacks or queues, you'll implement them from scratch, run tests, and see your progress in real-time.

## Quick Start

1. **Browse challenges** - Head to the [challenges page](/challenges) and pick something that looks interesting
2. **Choose your language** - We support TypeScript, Python, JavaScript, Go, Java, and C++
3. **Clone the repo** - Each challenge comes with starter code and tests
4. **Run tests locally** - Use our CLI tool to test your code as you work
5. **Submit when ready** - Once all tests pass, submit your solution

## Installing the CLI

The DSA CLI lets you test your code locally before submitting.

```bash
npm install -g @dsa-lab/cli
```

Or if you're using a package manager:

```bash
# Using pnpm
pnpm add -g @dsa-lab/cli

# Using yarn
yarn global add @dsa-lab/cli
```

Verify the installation:

```bash
dsa --version
```

## Your First Challenge

Let's walk through building a Stack:

1. Go to the [Stack challenge](/challenges/stack)
2. Select your preferred language
3. Copy the git clone command
4. Clone the repository:

```bash
git clone https://github.com/dsa-lab/stack-typescript
cd stack-typescript
```

5. Install dependencies (if needed)
6. Run tests to see what you need to implement:

```bash
dsa test
```

7. Open the project in your editor and start coding
8. Run tests as you work to see your progress
9. When all tests pass, submit your solution:

```bash
dsa submit
```

## Project Structure

Each challenge comes with:

- **Starter code** - Basic structure to get you going
- **Test files** - Comprehensive tests for your implementation
- **README.md** - Detailed instructions and hints
- **dsa.config.json** - Configuration for the CLI tool

## Getting Help

- Check the [CLI Reference](/docs/cli-reference) for command details
- Look at the challenge description for hints and examples
- Review the test failures to understand what's expected

## Next Steps

Once you've completed your first challenge, try:

- Tackling more advanced data structures
- Exploring different languages
- Building the integration projects
- Contributing improvements back to the project

Ready to start? Head to the [challenges page](/challenges) and pick something to build.

