# UPCI Wall of Honor

The UPCI Wall of Honor is a web-based application used as the primary display
for the Wall of Honor in the UPCI headquarters. There are three primary pages:

* Executive Leadership - the ministers who make up the executive leadership,
  executive board, and general board of the UPCI.
* Deceased Ministers - all ministers affiliated with the UPCI who have preceded
  us in death.
* Order of the Faith - all ministers inducted into the Order of the Faith.

## Project Management

The [UPCI Wall Of Honor](https://trello.com/b/6Pb9pe8x/upci-wall-of-honor)
Trello board is used to manage this project. The project follows a loose
Kanban-style system with the following types of lists:

* TODO: *milestone* - Stories and tasks in the backlog for the given release
  milestone.
* In Progress - Stories and tasks under active development.
* In Review - Stories and tasks which are completed and require review from
  project stakeholders.
* Done: *milestone* - Stories and tasks completed for the given release
  milestone.

## Operations

### Project Bootstrapping

*TODO*

### Creating Environments

*TODO*

### Build and Deploy

The top-level Makefile defines the following targets for building and deploying
the project:

- `clean`: remove all build artifacts
- `build`: rebuild the project
- `deploy`: deploy the built project to the various environments.

Both the `build` and `deploy` targets use an environment variable named
`UPCI_WOH_TARGET_ENV` to determine which environment is being targetted. Valid
targets will depend on the environments which have been created. Currently the
valid environments are: `dev`, `demo`, and `prod`.

So, for example, to do a full rebuild and deploy to the `dev` environment, one
would invoke:

```sh
UPCI_WOH_TARGET_ENV=dev make clean build deploy
```

## Development

### Local Environment Setup

Requirements:
- [Node v12 (or newer)](https://nodejs.org)
- [AWS CLI](https://aws.amazon.com/cli/)

#### AWS Setup

The Wall of Honor project lives in the AWS ecosystem. There are a number of
things you will need to setup to have access to this environment:

- You will need an IAM account on the UPCI Wall of Honor AWS environment. When
  you onboarded, the current project admin should have set this up for you and
  provided you with your account credentials.
- In order to pull the code you will need to [associate an SSH key with your IAM
  account.][codecommit-git-cred]
- The build and deploy scripts make use of the AWS CLI. You will need to
  [configure your AWS credentials in a way the CLI can access
  them.][cli-cred-setup]


[codecommit-git-cred]: https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up.html#setting-up-standard
[cli-cred-setup]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

#### Local Development Setup

Assuming a UNIX-like environment, you can get setup quickly by doing the
following:

```sh
# Clone the repo
git clone ssh://git-codecommit.us-east-2.amazonaws.com/v1/repos/upci-wall-of-honor

# Install the webapp dependencies
cd upci-wall-of-honor/webapp
npm install

# Build the project
npm run build-dev

# Stand up a local server
npm run serve &
```

Note that the above example does not automatically watch for changes. The
server is running the background, so you can cause it to update by running `npm
run build-dev` without having to restart the server, but this rebuild doesn't
happen automatically. As an alternative to the `npm run build-dev && npm run
serve &` combination, you can also use `npm run vue-serve` which uses the
Vue-specific development server which does support automatic rebuilds and
hot-reloading of the project as you make changes. The core team finds that the
vue hot-reloading functionality can sometimes lead to inconsistent state in the
running application but your mileage may vary.
