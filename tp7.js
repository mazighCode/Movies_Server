
let express = require('express');
let mustache = require('mustache-express');

let app = express();
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

let movies = require('./movies_sql_template');
movies.load('movies.json');
let file = 'movies.json';


app.get('/', (req, res) => {
    res.render('movie-list',  {movies: movies.list()})
});


app.get('/movie-details/:id', (req, res) => {
    res.render('movie-details', movies.read(req.params.id));
});


app.get('/delete-movie-form/:id', (req, res) => {
    res.render('delete-movie-form', {id: req.params.id});
});



app.get('/delete-movie/:id', (req, res) => {
    movies.delete(req.params.id);
    res.redirect('/');
    movies.save(file);

});


app.get('/add-movie-form', (req, res) => {
    res.render('add-movie-form', {id: req.params.id});   
});

app.get('/add-movie', (req, res) => {
    movies.create(req.query.title, req.query.year, req.query.actors, req.query.plot, req.query.poster);
    res.redirect('/');
    movies.save(file);

});


app.get('/edit-movie-form/:id', (req, res) => {
    res.render('edit-movie-form', {id: req.params.id});  
});

app.get('/edit-movie/:id', (req, res) => {
    movies.update(req.params.id, req.query.title, req.query.year, req.query.actors, req.query.plot, req.query.poster);
    res.redirect('/');
    movies.save(file);

});


app.listen(3000, () => console.log('movie server at http://localhost:3000'));






