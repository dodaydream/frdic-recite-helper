const express = require('express');
const readline = require('readline');
const fs = require('fs');
const cors = require('cors');
const google = require('googlethis');
const app = express();
const { parse } = require('node-html-parser');

const PORT = 3000;
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
  const illustration = req.query.i ?? false

  const images = await google.image(searchWord + (illustration ? ' illustration' : ''), {
    safe: false,
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

app.get('/etymology', async (req, res) => {
  const searchWord = req.query.q

  const ENDPOINT = `https://etymologeek.com/fra/${searchWord}`
  const BASEURL = 'https://etymologeek.com'

  const response = await fetch(ENDPOINT)

  // check if the response is ok
  if (response.status !== 200) {
    res.json({
      pi: null,
      details: null
    })

    return;
  }
  
  const document = await response.text().then(text => parse(text))

  const obj = document.querySelector('#pi');

  const tbl = document.querySelector('#tb');

  const etymologies = tbl ? tbl.querySelectorAll('tr').map(tr => {
    const tds = tr.querySelectorAll('td');
    return {
      entry: tds[0].text,
      def: tds[2].text
    }
  }) : null

  res.json({
    pi: obj ? BASEURL + obj.getAttribute('data') : null,
    details: etymologies
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
