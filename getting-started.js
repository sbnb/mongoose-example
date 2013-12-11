// Extension of MongooseJS Getting Started example
var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test-mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {runAfterDbIsOpen(mongoose)});

function runAfterDbIsOpen(mongoose) {
    console.log('ok db is open!');
    var Kitten = mongoose.model('Kitten', createKittySchema(mongoose));
    var kittens = makeSomeKittens(Kitten);
    async.series([
            function(cb) {
                removeAllKittens(Kitten, cb);
            },
            function(cb) {
                saveSomeKittens(kittens, cb);
            },
            function(cb) {
                findAllKittens(Kitten, cb);
            },
            function(cb) {
                findKittensLike(Kitten, 'Fluffy', cb);
            }
        ],
        function (err, result) {
            console.log('series complete ok');
        });
}

function createKittySchema(mongoose) {
    var kittySchema = mongoose.Schema({
        name: String
    });
    kittySchema.methods.speak = function () {
        var greeting = this.name ?
            "My name is " + this.name :
            "I have no name :(";
        console.log(greeting);
    };
    return kittySchema;
}

function makeSomeKittens(Kitten) {
    var names = ['Silence', 'Fluffy', 'Marlowe', 'Molly'],
        kittens = [];

    console.log('making some kittens:', names);
    for (var i = 0; i < names.length; i += 1) {
        kittens.push( new Kitten({name: names[i]}) );
    };
    return kittens;
}

function removeAllKittens(Kitten, callback) {
    Kitten.remove({name: new RegExp('')}, function (err) {
        callback(null);
    });
}

function saveSomeKittens(kittens, callback) {
    console.log('saving ' + kittens.length +  ' kittens');
    async.each(kittens, saveAKitten, function(err) {
        if (err) {
            console.log('async save error', err);
        }
        else {
            console.log(kittens.length + ' kittens saved ok');
        };
        callback(err);
    });
}

function saveAKitten(kitten, callback) {
    kitten.save(function (err, kitty) {
        if (err) {
            console.log('save error:', err);
        }
        else {
            console.log('  saved kitty:', kitty.name);
        }
        callback(err);
    });
}

function findAllKittens(Kitten, callback) {
    console.log('looking for kittens');
    Kitten.find(function (err, kittens) {
        if (err) {
            console.log('error finding:', err);
        }
        else {
            console.log(kittens);
        };
        callback(err);
    });
}

function findKittensLike(Kitten, name, callback) {
    console.log('looking for kittens like ' + name);
    Kitten.find({name: new RegExp(name)}, function (err, kittens) {
        if (err) {
            console.log('error finding:', err);
        }
        else {
            console.log(kittens);
        };
        callback(err);
    })
}