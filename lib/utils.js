// import marked from 'marked';
import marked from 'markdown-it';
import marked_images from 'markdown-it-obsidian-images';
import { find } from 'lodash';
import path from 'path';

export const hasMdExtension = (path) => {
  const ext = path.split('').slice(-3).join('');
  return ext === '.md';
}

export const sendFile = (content, tree, res) => {
  if (content) {
    // TODO: this is a hack to get the relative path to the root of the site
    const tempBaseUrl = "http://localhost:3789/"
    const renderedContent = marked().use(marked_images({ baseURL: tempBaseUrl, makeAllLinksAbsolute:true })).render(content)

    res.render('page', {
      tree,
      title: 'req.url',
      content: renderedContent
    });
  } else {
    res.render('404', {
      tree,
      title: '404',
      content: 'that file does not exist'
    });
  }
}

export const sendError = (status, content, res) => {
  res.render('404', {
    title: status,
    content
  });
};

export const indexTree = (tree, depth) => {
  const newTree = Object.assign({}, tree);
  newTree.children = [];
  const children = tree.children || [];
  // check if index.md exists as a child of current tree
  newTree.indexed = !!find(children, child => child.name === 'index.md');
  // set the depth for appropriate <li> indentation
  newTree.depth = depth;

  // copy or recursively copy each child
  children.forEach(child => {
    if(child.path.indexOf("/.") > -1) return; // hack to ignore hidden directories and files
    
    // ignore hidden files"))
    if (child.children) {
      newTree.children.push(indexTree(child, depth + 1));
    } else {

      if(child.path.endsWith(".md") == false) return; // hack to ignore non-markdown files

      child.depth = depth + 1;
      newTree.children.push(Object.assign({}, child));
    }
  });

  return newTree;
};
