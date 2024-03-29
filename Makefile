MOCHA_OPTS= --slow 0 -A
REPORTER = spec

lint-fix:
	./node_modules/.bin/eslint --fix index.js test/*.js

lint-check:
	./node_modules/.bin/eslint index.js test/test.js

commit:
	@node ./node_modules/ac-semantic-release/lib/commit.js

test-release:
	DEBUGMODE=true node ./node_modules/ac-semantic-release/lib/release.js

release:
	@node ./node_modules/ac-semantic-release/lib/release.js	--branch master

.PHONY: check
