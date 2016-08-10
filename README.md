# los-metrics

Utilities to compute metrics for the LOS circle.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Create your `.env.<NODE_ENV>` files as appropriate for each environment. This software depends on unpublished ZenHub APIs. You'll have to "sniff" your unpublished API token using Chrome developer tools by looking at the request for the `/board` endpoint:

        GITHUB_API_TOKEN=<YOUR GITHUB API TOKEN>
        ZENHUB_API_TOKEN=<YOUR ZENHUB API TOKEN>
        ZENHUB_API_UNPUBLISHED_TOKEN=<YOUR ZENHUB API TOKEN FOR UNPUBLISHED APIS>
        CODECLIMATE_API_TOKEN=<YOUR CODECLIMATE API TOKEN>

3. Run the setup tasks:

        $ npm install

4. Run the 'metrics' script:

        $ npm run metrics

## License

See the [LICENSE](./LICENSE) file.
