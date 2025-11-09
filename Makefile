.PHONY: install-cli install-cli-remote

install-cli:
	@echo "Installing DSA CLI from local workspace..."
	@DSA_CLI_LOCAL_DIR="$(PWD)/cli" bash ./scripts/install-cli.sh

install-cli-remote:
	@echo "Installing DSA CLI from remote repository..."
	@bash ./scripts/install-cli.sh

