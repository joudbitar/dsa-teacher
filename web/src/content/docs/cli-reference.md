# CLI Reference

Complete guide to using the DSA Lab command-line interface.

## Installation

```bash
npm install -g @dsa-lab/cli
```

## Commands

### `dsa test`

Run tests for your current challenge.

```bash
dsa test
```

This command:
- Runs all test cases for your challenge
- Shows which tests pass and fail
- Displays progress percentage
- Updates your local progress tracking

**Options:**
- `--watch` or `-w`: Watch mode - automatically reruns tests when files change
- `--verbose` or `-v`: Show detailed test output

### `dsa submit`

Submit your solution when all tests pass.

```bash
dsa submit
```

This command:
- Validates that all tests pass
- Submits your solution to the server
- Updates your progress on the dashboard
- Marks the challenge as completed

**Note:** You must be authenticated and have a valid project token to submit.

### `dsa init`

Initialize a new challenge project.

```bash
dsa init
```

This creates a new `dsa.config.json` file in your project with the default configuration.

### `dsa status`

Check the status of your current challenge.

```bash
dsa status
```

Shows:
- Current challenge name
- Progress percentage
- Number of tests passing
- Last submission time

## Configuration

### dsa.config.json

Each challenge project should have a `dsa.config.json` file:

```json
{
  "challengeId": "stack",
  "language": "typescript",
  "projectToken": "your-project-token-here"
}
```

**Fields:**
- `challengeId`: The ID of the challenge (e.g., "stack", "queue")
- `language`: Your chosen language (typescript, python, javascript, go, java, cpp)
- `projectToken`: Your project authentication token (found in the challenge page)

## Authentication

To submit solutions, you need a project token:

1. Go to your challenge page on the web
2. Select your language
3. Copy the project token from the challenge details
4. Add it to your `dsa.config.json` file

## Troubleshooting

### Tests not running

- Make sure you're in the challenge directory
- Check that `dsa.config.json` exists and is valid
- Verify your language runtime is installed (Node.js, Python, etc.)

### Submission failed

- Ensure all tests pass locally first
- Check that your project token is correct
- Verify you have an internet connection
- Make sure you're authenticated

### Command not found

- Verify the CLI is installed: `dsa --version`
- Check that the global npm bin directory is in your PATH
- Try reinstalling: `npm install -g @dsa-lab/cli`

## Examples

### Running tests in watch mode

```bash
dsa test --watch
```

### Checking status before submitting

```bash
dsa status
dsa test
dsa submit
```

### Verbose test output

```bash
dsa test --verbose
```

