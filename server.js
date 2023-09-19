const express = require('express');
const readline = require('readline');
const fs = require('fs');
const cors = require('cors');
const google = require('googlethis');

const app = express();
const port = 3000;
app.use(cors())

app.get('/search', (req, res) => {
  const filePath = 'lexique/Lexique383.tsv';
  const searchWord = req.query.q

  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: stream, terminal: false });

  rl.on('line', (line) => {
    if (line.startsWith(searchWord)) {
      res.write(line + '\n');
    }
  });

  rl.on('close', () => {
    res.end(null);
  });
});

app.get('/images', async (req, res) => {
    const searchWord = req.query.q

    const images = await google.image(searchWord, { safe: false,
          additional_params: {
    hl: 'fr',
              lr: 'fr'
  }
    });

      try {
    const promises = images.slice(0, 3).map(async (item) => {
      const response = await fetch(item.preview.url);
      const buffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      return {
        ...item,
        preview: {
          ...item.preview,
          url: dataUrl
        }
      };
    });

    const results = await Promise.all(promises);

    res.json(results);
  } catch (error) {
      console.log(error)
    res.status(500).json({ error: 'An error occurred' });
  }

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
