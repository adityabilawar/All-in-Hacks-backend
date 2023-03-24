const express = require("express");
const mongoose = require('mongoose')
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());

const uri = `mongodb+srv://adityabilawar:${process.env.mongo_api}@leadscluster.moi2vx9.mongodb.net/?retryWrites=true&w=majority`

async function connect() {
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/create-message", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
            ${prompt}
              Hi! Can you a letter to CEO Elon Musk from the company Tesla where you are selling
              a product that can automate his process of developing Tesla car screens.
            
            `,
      max_tokens: 3000,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].text,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));