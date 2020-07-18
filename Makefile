UPCI_WOH_TARGET_ENV ?= dev

build:
	(cd webapp && UPCI_WOH_TARGET_ENV=${UPCI_WOH_TARGET_ENV} ./build.sh)

deploy:
	(cd webapp && UPCI_WOH_TARGET_ENV=${UPCI_WOH_TARGET_ENV} ./deploy.sh)

clean:
	-rm -r webapp/dist
