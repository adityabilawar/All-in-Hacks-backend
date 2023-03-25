//const csv = require('csv-parser')
const fs = require('fs')
const csv = require('csvtojson');
const { Parser } = require('json2csv');
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const result = [];
var dataArray = [];
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
(async () => {

    //load the leads
    const leads = await csv().fromFile("leads.csv");

    //show leads
    console.log(leads);

    //Modify the leads 
    const user = 'Aditya Bilawar';
    const userCompanyName = 'SalesForce';
    const userCompanyDescription = 'email marketing';
    const letterType = 'Linkedin invite message';
    const position = leads[0].Position;
    const company = leads[0].Company;
    const firstName = leads[0].firstName;
    const lastName = leads[0].lastName;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
                Hi! Can you write a ${letterType} on behalf of ${user} to the ${position} of the company ${company} whos name is ${firstName} ${lastName} where you are selling
                a product that can automate his process of developing Tesla car screens.
              `,
        max_tokens: 3000,
        temperature: 0,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
    console.log(response.data.choices[0].text);
    leads[0].gptResponse = response.data.choices[0].text;

    //save the csv 
    const leadsInCSV = new Parser({ fields: ["firstName", "lastName", "Company", "Position", "linkedinURL", "gptResponse"]}).parse(leads);
    fs.writeFileSync("leads.csv", leadsInCSV);
})();



// app.post("/create-message", async (req, res) => {
//         try {
//           const { prompt } = req.body;
//           const response = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt: `
//                     Hi! Can you write a ${letterType} on behalf of ${user} to the ${position} of the company ${company} whos name is ${firstName} ${lastName} where you are selling
//                     a product that can automate his process of developing Tesla car screens.
                  
//                   `,
//             max_tokens: 3000,
//             temperature: 0,
//             top_p: 1.0,
//             frequency_penalty: 0.0,
//             presence_penalty: 0.0,
//           });
      
//           return res.status(200).json({
//             success: true,
//             data: response.data.choices[0].text,
//           });
//         } catch (error) {
//           return res.status(400).json({
//             success: false,
//             error: error.response
//               ? error.response.data
//               : "There was an issue on the server",
//           });
//         }
//       });