# github-top-most-reviewed-prs

Wanna see who makes it to the Hall of Fame of the most reviewed PRs in your repository?

You came to the right place!

## How to run?

1. create a `.env` file and set your variables just like in `.env.example`

2. run

    `node --env-file=.env index.js [top_count]`

    **top_count** - optional, default 10

## Required Node.js version

You need at least:

-   Node.js 20 because of the `--env-file` flag.
-   Node.js 18 because of using the Fetch API

## You don't want to install Node.js, use Docker!

1. build

    `docker build -t github-top-most-reviewed-prs .`

2. run

    `docker run -e top_count=50 github-top-most-reviewed-prs`

    **top_count** - optional, default 10
