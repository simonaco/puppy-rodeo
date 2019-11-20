/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const outputs = [];

    const input = context.df.getInput();
    const puppyName = input.puppy;
    if (!puppyName) {
      throw new Error('A dog name is required as an input.');
    }

    const images = yield context.df.callActivity(
        'search-images',
        puppyName
      );
      const tag = yield context.df.callActivity(
        'get-tag',
        puppyName
      );

      const uploadImages = yield context.df.callActivity(
        'upload-images',
        {
          id: tag.id,
          urls: images
        }
      );

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    console.log(JSON.stringify(outputs))
    return outputs;
});