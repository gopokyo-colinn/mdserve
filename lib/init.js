import express from 'express';
import jade from 'pug';
import path from 'path';
import bluebird from 'bluebird';
import removeExt from 'remove-ext';
import fs from 'fs';
import Promise from 'bluebird';
import directoryTree from 'directory-tree';
import {
  hasMdExtension,
  sendFile,
  sendError,
  indexTree
} from './utils';

Promise.promisifyAll(require('fs'));

const init = (port, directory) => {
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', path.resolve(__dirname, 'views'));
  app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
  app.use('/_assets', express.static(path.resolve(directory, '_assets')));


  // Serving all content (needed for imatges and other media)
  app.use(express.static(directory));


  const sourceDirectory = indexTree(directoryTree(directory), 0);

  app.get('*', async (req, res) => {
    try {
      let content;
      // / defaults to index.md
      if (req.url === '/') {
        req.url = '/index.md';
      }
      // remove trailing slash
      if (req.url[req.url.length - 1] === '/') {
        req.url = req.url.slice(0, req.url.length - 1);
      }

      const decodedUrl = decodeURIComponent(req.url);

      if (!hasMdExtension(decodedUrl)) {
        let fileStats;
        let documentTitle = path.basename(decodedUrl)
        let front = documentTitle + "\n" + new Array(documentTitle.length + 1).join( "=" );
         
        try {
          content = await fs.readFileAsync(path.resolve(directory + decodedUrl + '/index.md'), 'utf8');
          sendFile(front + content || "Empty", sourceDirectory, res);
        } catch(e) {
          content = await fs.readFileAsync(path.resolve(directory + decodedUrl + '.md'), 'utf8');
          sendFile(front + "\n" + content || "Empty", sourceDirectory, res);
        }
      } else {
        content = await fs.readFileAsync(path.resolve(directory + decodedUrl), 'utf8');
        sendFile(content || "Empty", sourceDirectory, res);
      }
    } catch(e) {
      sendError(500, 'That page cannot be served -> ' + e.message, res);
    }
  });
  app.listen(port);
  console.log(`Markdown server running on port ${port}`);
}

module.exports = init;