# product-metrics

This is a simple web application to compute and display product development metrics.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Setup [pow][pow]. Then figure out which port you intend to use and create the pow config file:

        $ echo 9004 > ~/.pow/product-metrics.learnersguild

3. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development

7. Create your `.env` file for your environment. Example:


        PORT=9004
        APP_BASEURL=http://product-metrics.learnersguild.dev
        AUTH0_CLIENT_ID=<Auth0 client ID>
        AUTH0_CLIENT_SECRET=<Auth0 client secret>
        ZENHUB_PRIVATE_API_TOKEN=<ZenHub private API token>
        ZENHUB_PUBLIC_API_TOKEN=<ZenHub public API token>
        GITHUB_API_TOKEN=<GitHub API token>
        GITHUB_REPOS=learning-os,learning-os-software,product-metrics
        COMPUTATION_SCHEDULE=0 0 3 * * *

8. Run the setup tasks:

        $ npm install

9. Run the server:

        $ npm start

10. Visit the server in your browser:

        $ open http://product-metrics.learnersguild.dev

## License

See the [LICENSE](./LICENSE) file.
