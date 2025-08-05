//express
const express = require('express');
const stocksRoutes = require('./routes/stock.route');
const holdingsRoutes = require('./routes/holdings.route.js');
const current_price=require('./config/currentPriceUpdater.js')
const transactionRoutes = require('./routes/transaction.route.js');
const Groq = require('groq-sdk');const app = express();
const cors = require('cors');
const port = 5000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors()); // Enable CORS for all routes
// Parse JSON bodies

app.use(express.json()); 
app.use('/stocks', stocksRoutes);

priceUpdater = require('./config/priceUpdater');

app.use('/holdings', holdingsRoutes);

app.use('/transactions', transactionRoutes);

const userRoutes = require('./routes/user.route.js');
app.use('/users', userRoutes);

const groq = new Groq({ apiKey: "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" });

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: userMessage }
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
    });

    const response = chatCompletion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    current_price(); // Start the current price updater
    priceUpdater(); // Start the price updater
  });