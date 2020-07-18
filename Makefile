UPCI_WOH_TARGET_ENV ?= dev

build:
	(cd webapp && UPCI_WOH_TARGET_ENV=${UPCI_WOH_TARGET_ENV} codebuild/build.sh)

deploy:
	(cd webapp && UPCI_WOH_TARGET_ENV=${UPCI_WOH_TARGET_ENV} codebuild/deploy.sh)

clean:
	-rm -r webapp/dist

cicd-build-and-deploy:
	aws codebuild start-build \
		--project-name upci-wall-of-honor-frontend \
		--environment-variables-override \
			"name=UPCI_WOH_TARGET_ENV,value=${UPCI_WOH_TARGET_ENV},type=string"
