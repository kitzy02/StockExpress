//express
const express = require('express');
const stocksRoutes = require('./routes/stock.route');
const holdingsRoutes = require('./routes/holdings.route.js');
const current_price=require('./config/currentPriceUpdater.js')
const transactionRoutes = require('./routes/transaction.route.js');
const watchlistRoutes = require('./routes/watchlist.route.js');

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

app.use('/watchlist',watchlistRoutes );

const userRoutes = require('./routes/user.route.js');
app.use('/users', userRoutes);

const groq = new Groq({ apiKey: "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" });
app.use(require('express-status-monitor')())
app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) return res.status(400).json({ error: 'Message required' });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "ONLY ANSWER FINANCIAL QUESTIONS. SAY : IM NOT ALLOWED TO ANSWER OTHER QUESTIONS." 
         }, {
          role: "user",
          content: userInput
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      max_tokens: 1024
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    current_price(); // Start the current price updater
    priceUpdater(); // Start the price updater
  });
