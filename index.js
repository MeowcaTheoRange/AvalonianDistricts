var express = require('express');
var path = require("path");
var fs = require("fs");
var app = express();

app.set('view engine', 'ejs');
app.use("/a", express.static(path.join(__dirname, 'assets')));
app.use("/assets", express.static(path.join(__dirname, 'assets', "Files")));

var getPages = () => JSON.parse(fs.readFileSync(path.join(__dirname, "views", "pages.json"), 'utf8'));
var getPage = (page) => {
  var pageindexes = getPages();
  console.log(pageindexes.pages, page, pageindexes.pages[page]);
  if (pageindexes.pages[page].link.redirect)
    return getPage(pageindexes.pages[page].link.location);
  return {
    name: page,
    page: pageindexes.pages[page],
    all: pageindexes
  };
}

app.get('/wiki/:page', function(req, res, next) {
  try {
    if (!getPages().pages[req.params.page]) next();
    var page = getPage(req.params.page);
    res.render('index', page);
  } catch (error) {
    next(error);
  }
});

app.use(function(req,res){
  res.status(404).render('index', getPage("404_Not_Found"));
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
