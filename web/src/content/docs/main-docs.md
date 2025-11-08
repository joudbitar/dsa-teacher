# DSA Lab Documentation

Welcome to the DSA Lab Documentation — your guide to learning, building, and understanding computer science from the ground up.

Whether you've never opened a terminal before or you're brushing up on data structures, this guide will walk you through everything step by step.

---

## Getting Started

New to DSA Lab? Start here to understand what the platform is and how to use it.

### What DSA Lab Is

DSA Lab is a learning platform that helps you master the fundamentals of computer science — the things AI can't think through for you.

You'll build classic data structures and algorithms from scratch (like stacks, queues, and linked lists), test them locally, and see instant results — just like a real engineer.

### How It Works

1. **Web Interface:** Choose your challenge, track your progress, and learn through visual guides.

2. **CLI (Command Line Tool):** Code locally on your computer, run tests, and submit solutions directly from your terminal.

3. **GitHub Integration:** Every challenge creates a repository for you, so your code lives in the real developer environment.

### Setting Up Your Environment

You'll use a few standard developer tools — don't worry, we'll guide you through each one.

#### What's a Terminal?

The terminal (or command line) is how developers interact with their computer using text commands instead of buttons.

You'll use it to:

- Run commands like `dsa test` or `dsa submit`
- Navigate folders (using `cd`, `ls`, or `dir`)
- Install dependencies and run programs

If you've never used one before — don't panic. You'll pick it up in minutes.

#### Connecting GitHub

GitHub is where your code lives and version control happens.

You'll connect your account so DSA Lab can:

- Automatically create your challenge repositories
- Track your submissions and progress
- Let you share your code publicly or with peers

#### Picking Your First Challenge

Once connected, start with Build a Stack — a simple but powerful concept that forms the foundation of recursion and memory management.

→ [Start Learning ›](./getting-started.md)

---

## CLI Reference

The DSA CLI (Command-Line Interface) lets you code, test, and submit challenges directly from your computer.

### What You Can Do

- Run your solution locally with `dsa test`
- Submit your solution with `dsa submit`
- Check your project's setup with `dsa info`

### Configuration

Every project comes with a `dsa.config.json` file — this keeps track of your challenge, project token, and test mapping.

### Authentication

Each challenge uses a project token — a unique key that identifies your project.

This lets the system validate your submissions and update your progress in real-time.

### Troubleshooting

If something doesn't work:

- Check that you're in the right folder
- Re-run `dsa login` to refresh your credentials
- Visit the "Troubleshooting" section in the CLI docs for specific issues

→ [View CLI Docs ›](./cli-reference.md)

---

## API Reference

For developers who want to integrate or extend DSA Lab, here's what happens under the hood.

### What's an API?

An API (Application Programming Interface) is how different systems talk to each other.

Our web app, CLI, and backend communicate using REST endpoints.

### Endpoints

- `GET /api/modules` → List all challenges
- `POST /api/projects` → Create a new project for a user
- `POST /api/submissions` → Submit your code results

### Authentication

All API calls use your project token — keep it secret, like a password.

It ensures submissions and data updates come from verified users.

→ [Explore API Reference ›](./api-reference.md)

---

## About DSA Lab

> "Built by vibe coders, for real coders. Learn multiplication before you touch the calculator."

DSA Lab is about learning the why behind code — not just getting the right answer.

We believe coding is best learned through building, breaking, and fixing — just like real engineers do.

Each challenge you complete is a step toward mastering computer science in a practical, project-based way.

---

### Quick Links

- [Challenges](/challenges)
- [About](/about)
- [GitHub Repository](https://github.com/dsalab)

---

© 2025 **DSA Lab** — Built for hackers who want to master fundamentals.
