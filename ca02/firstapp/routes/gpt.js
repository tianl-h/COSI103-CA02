const express = require('express');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
const axios = require('axios');
const apiKey = process.env.APIKEY;
console.log("API key:", apiKey);


class GPT {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.modelEngine = 'text-davinci-003';
  }

  async get_tech_chef_challenge(prompt) {
    // Generate a GPT response with a given prompt
    const response = await this.getResponse(prompt);
    return response;
  }
  
  async get_joke(prompt) {
    // Generate a GPT response with a given prompt
    const response = await this.getResponse("May I get a joke about "+ prompt);
    return response;
  }
    async get_poem(prompt) {
    // Generate a GPT response with a given prompt
    const response = await this.getResponse("Generate a poem about the programming language  "+ prompt);
    return response;
  }
  

  async getResponse(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return response.data.choices[0].text;
  }

  // Add other GPT methods here, similar to the Python class
}

// create .env and put your actual OpenAI API key
const gpt = new GPT(apiKey);

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Example route for getting a response from GPT
router.get('/gpt-response',
  isLoggedIn,
  async (req, res, next) => {
    try {
      const prompt = 'What does OpenAI\'s GPT stand for?';
      const response = await gpt.getResponse(prompt);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
);

// Route to display the GPT form
router.get('/gpt/form',
  isLoggedIn,
  (req, res, next) => {
    res.render('gpt/form');
  }
);

// Route to handle form submission and display GPT response
router.post('/gpt-response',
  isLoggedIn,
  async (req, res, next) => {
    try {
      const gptMethod = req.body.gptMethod;
      const userInput = req.body.userInput;
      // Use the gptMethod to call the appropriate GPT function
      // For this example, we'll just use the getResponse function
      const response = await gpt.getResponse(userInput);
      res.render('gpt/result', { prompt: userInput, response });
    } catch (error) {
      next(error);
    }
  }
);

// Route to display Tianling's GPT form
router.get('/gpt/tianling_form',
  isLoggedIn,
  (req, res, next) => {
    res.render('gpt/tianling_form');
  }
);

// Route to display Shan's GPT form
router.get('/gpt/shan_form',
  isLoggedIn,
  (req, res, next) => {
    res.render('gpt/shan_form');
  }
);
// Route to display Bing's GPT form
router.get('/gpt/bing_form',
  isLoggedIn,
  (req, res, next) => {
    res.render('gpt/bing_form');
  }
);
// Route to handle Tianling's form submission and display GPT response
router.post('/gpt/tianling-response',
  isLoggedIn,
  async (req, res, next) => {
    try {
      const userInput = req.body.userInput;
      const response = await gpt.get_tech_chef_challenge(userInput);
      res.render('gpt/result', { prompt: userInput, response });
    } catch (error) {
      next(error);
    }
  }
);


// Route to handle shan's form Joke Generator submission and display GPT response
router.post('/gpt/shan-response',
  isLoggedIn,
  async (req, res, next) => {
    try {
      const userInput = req.body.userInput;
      const response = await gpt.get_joke(userInput);
      res.render('gpt/result', { prompt: userInput, response });
    } catch (error) {
      next(error);
    }
  }
);
// Route to handle Bing's form Poem Generator submission and display GPT response
router.post('/gpt/bing-response',
  isLoggedIn,
  async (req, res, next) => {
    try {
      const userInput = req.body.userInput;
      const response = await gpt.get_poem(userInput);
      res.render('gpt/result', { prompt: userInput, response });
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
