artifact_name := transaction-search-tool

.PHONY: build
build: clean init submodules
	npm run build

.PHONY: submodules
submodules:
	git submodule init
	git submodule update

.PHONY: clean
clean:
	rm -rf dist/app dist/static

.PHONY: npm-install
npm-install:
	npm i

.PHONY: test-unit
test-unit:
	npm run test

.PHONY: package
package: init build 
ifndef version
	$(error No version given. Aborting)
endif
	$(info Packaging version: $(version))
	$(eval tmpdir := $(shell mktemp -d build-XXXXXXXXXX))
	cp -r ./dist $(tmpdir)
	cp -r ./package.json $(tmpdir)
	cp -r ./package-lock.json $(tmpdir)
	cp ./start.sh $(tmpdir)
	cp ./routes.yaml $(tmpdir)
	cd $(tmpdir) && npm i --production
	rm $(tmpdir)/package.json $(tmpdir)/package-lock.json
	cd $(tmpdir) && zip -r ../$(artifact_name)-$(version).zip .
	rm -rf $(tmpdir)

.PHONY: init
init: npm-install