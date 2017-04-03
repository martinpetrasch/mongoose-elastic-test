var mongoose = require('mongoose');
var mexp = require('mongoose-elasticsearch-xp');
var util = require('util');

mongoose.connect('mongodb://localhost/nestedbooktest', function (err) {
    if (err) {
        console.error(err.error);
    } else {
        console.log('Connected to MongoDB');

        var PageSchema = new mongoose.Schema({
            number: {
                type: Number,
                es_indexed: true
            },
            text: {
                type: String,
                es_indexed: true
            }
        });
        
        var BookSchema = new mongoose.Schema({
            title: {
                type: String,
                es_indexed: true
            },
            pages: {
                type: [PageSchema],
                es_indexed: true,
                es_type: 'nested',
                es_include_in_parent: true
            }
        });

        // we need to populate 'pages'?
        BookSchema.plugin(mexp,{
            populate: [
                {path: 'pages', select: 'number text'},
            ]
        });
        PageSchema.plugin(mexp);

        var Book = mongoose.model('Book', BookSchema);
        var Page = mongoose.model('Page', PageSchema);

        // define a book and two pages
        var book1 = new Book({title: "Testbook"});
        var page1 = new Page({number: 1, text: 'Some sample text'});
        var page2 = new Page({number: 2, text: 'Another sample of example text'});

        // add page objects to book
        book1.pages.push(page1);
        book1.pages.push(page2);

        // save book and pages and check for a successful "es_indexed"
        book1.save(function (err) {
            console.log('book1 successfully saved');
            book1.on('es-indexed', function(err) {
            if (err) {
                throw err;
            }
            console.log('book1 indexed');
            });
        });

        page1.save(function (err) {
            console.log('page1 successfully saved');
            page1.on('es-indexed', function(err) {
                if (err) {
                    throw err;
                }
                console.log('page1 indexed');
            });
        });

        page2.save(function (err) {
            console.log('page2 successfully saved');
            page2.on('es-indexed', function(err) {
                if (err) {
                    throw err;
                }
                console.log('page2 indexed');
            });
        });

    }
});