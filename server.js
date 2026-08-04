const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = 'http://portalquery.just.ro/Query.asmx';

app.use(express.static(path.join(__dirname)));
app.use(express.text({ type: '*/*' }));

app.post('/soap-proxy', async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/soap+xml; charset=utf-8'
      },
      body: req.body
    });

    const responseText = await response.text();
    res.status(response.status);
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(name, value);
      }
    });
    res.send(responseText);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
