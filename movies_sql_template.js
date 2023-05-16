"use strict";

const fs = require('fs');
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');
db.prepare('drop table movies').run()
db.prepare('CREATE TABLE if not exists movies(id INTEGER PRIMARY KEY AUTOINCREMENT , title TEXT NOT NULL , year INTEGER NOT NULL , actors TEXT NOT NULL , plot TEXT NOT NULL , poster TEXT NOT NULL)').run();

exports.load = function(filename) {
  const movies = JSON.parse(fs.readFileSync(filename));
  let insert = db.prepare('INSERT INTO movies VALUES ' +
                          '(@id, @title, @year,' +
                          ' @actors, @plot, @poster)');
  let clear_and_insert_many = db.transaction((movies) => {
    db.prepare('DELETE FROM movies');
    for (let id of Object.keys(movies)) {
      insert.run(movies[id]);
    }
  });
  clear_and_insert_many(movies);
  return true;
};

exports.save = function(filename) {
  let movie_list = db.prepare('SELECT * FROM movies ORDER BY id').all();
  let movies = {};
  for (let movie of movie_list) {
    movies[movie.id] = movie;
  }
  fs.writeFileSync(filename, JSON.stringify(movies));
};

exports.list = function() {
  let moviesList= db.prepare('SELECT * FROM movies ORDER BY id').all();
  if(moviesList.length==0){
    return null;
  }
  return moviesList;
};

exports.create = function(title, year, actors, plot, poster) {
  let stmt = db.prepare('INSERT INTO movies (title, year, actors, plot, poster) VALUES (?, ?, ?, ?, ?)');
  let id_new_movie = stmt.run(title, year, actors, plot, poster).lastInsertRowid;
  return id_new_movie;
};

exports.read = function(id) {
  let stmt = db.prepare('SELECT * FROM movies WHERE id = ?');
  let fields = stmt.get(id);
  if(fields==undefined){
    return null;
  } else {
    return fields;
  }
};

exports.update = function(id, title, year, actors, plot, poster) {
  let res = db.prepare('UPDATE movies SET title = ?, year = ?, actors = ?, plot = ?, poster = ? WHERE id = ?').run(title, year, actors, plot, poster, id);
  return res.changes == 1;
};

exports.delete = function(id) {
let res = db.prepare('DELETE FROM movies WHERE id = ?').run(id);
return res.changes == 1;
};


