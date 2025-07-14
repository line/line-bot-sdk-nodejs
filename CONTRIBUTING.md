# How to contribute to LINE Bot SDK for Node.js

First of all, thank you so much for taking your time to contribute! LINE Bot SDK
for Node.js is not very different from any other open source projects you are aware of. It will
be amazing if you could help us by doing any of the following:

- File an issue in [the issue tracker](https://github.com/line/line-bot-sdk-nodejs/issues) to report bugs and propose new features and improvements.
- Ask a question using [the issue tracker](https://github.com/line/line-bot-sdk-nodejs/issues) (__Please ask only about this SDK__).
- Contribute your work by sending [a pull request](https://github.com/line/line-bot-sdk-nodejs/pulls).

## Development

### Install dependencies

Run `npm install` to install all dependencies for development.

### Understand the project structure

The project structure is as follows:

- `lib`: The main library code.
- `test`: Test code.
- `examples`: Example projects that use the library.
- `docs`: [VitePress](https://vitepress.dev/) markdowns for project documentation.
- `generator`: Custom OpenAPI generator implementation for this SDK.

### Edit OpenAPI templates

Almost all API client code is generated with OpenAPI Generator based on [line-openapi](https://github.com/line/line-openapi)'s YAML files.
Thus, you cannot edit most code under `lib` directory directly.

You need to edit the custom generator templates under the `generator` directory instead.

After editing the templates, run the `generate-code.py` script to generate the code, and then commit all affected files.
If not, CI status will fail.

When you update code, be sure to check consistencies between generated code and your changes.

### Add unit tests

We use [Vitest](https://vitest.dev/) for unit tests.
Please add tests to the appropriate test directories to verify your changes.

Especially for bug fixes, please follow this flow for testing and development:
1. Write a test before making changes to the library and confirm that the test fails.
2. Modify the code of the library.
3. Run the test again and confirm that it passes thanks to your changes.

### Run your code in your local

You can use the [example projects](examples/) to test your changes locally before submitting a pull request.


### Run CI tasks in your local

The following npm scripts are available for development:

* `npm run test`: Run test suites using Vitest.
* `npm run format`: Format source code with [Prettier](https://github.com/prettier/prettier).
* `npm run build`: Build TypeScript code into JavaScript. The built files will be placed in `dist/`.

We test, lint and build on CI, but it is always nice to check them before uploading a pull request.
For details on the commands executed in the CI, please refer to `.github/workflows/test.yml`.

### Documentation
This project uses two documentation systems:

1. **API Reference Documentation** - Generated with [TypeDoc](https://typedoc.org/)
   - Source is automatically generated from JSDoc comments in the code
   - Output files are located in the `docs/apidocs` directory
   - To generate API documentation, run: `npm run apidocs`

2. **User Documentation** - Built with [VitePress](https://vitepress.dev/)
    - Source files are located in the `docs` directory
    - Contains guides, tutorials, and general usage information
    - To build and serve user documentation locally, run: `npm run docs`

**Please make sure your new or modified code is covered by proper JSDoc comments.**
Good documentation ensures that contributors and users can easily read and understand how the methods and classes work.

## Contributor license agreement

When you are sending a pull request and it's a non-trivial change beyond fixing typos, please make sure to sign
[the ICLA (individual contributor license agreement)](https://cla-assistant.io/line/line-bot-sdk-nodejs). Please
[contact us](mailto:dl_oss_dev@linecorp.com) if you need the CCLA (corporate contributor license agreement).
