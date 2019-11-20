/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const axios = require('axios');
const URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search';
async function getImages(context) {
  try {
    const response = await axios.get(URL, {
      params: {
        q: context.bindings.name,
        imageType: 'photo'
      },
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
      }
    });
    return response.data.value;
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    throw new Error(error.message);
  }
}
module.exports = async function(context) {
  context.log(`>>>>>>>> Searching for images using search term: ${context.bindings.name}!`);
  const images = await getImages(context);
  return images;
};
