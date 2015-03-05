# Various programs
browserify := ./node_modules/.bin/browserify
jshint := ./node_modules/.bin/jshint
uglifyjs := ./node_modules/.bin/uglifyjs

# Build options
src := whitespace.js
all := $(shell $(browserify) --list $(src))

whitespace.min.js: $(all)
	$(browserify) -s collapse $(src) | $(uglifyjs) -m -o $@

lint:
	@$(jshint) $(all)

clean:
	rm -rf whitespace.min.js node_modules

test: whitespace.min.js
	@echo "Open test.html in your browser to run tests."

publish: whitespace.min.js
	npm publish

.PHONY: clean lint test publish
