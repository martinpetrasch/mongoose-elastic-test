# mongoose-elastic-test

Just a quick test for a nested elasticsearch mapping using [mongoose-elasticsearch-xp](https://github.com/jbdemonte/mongoose-elasticsearch-xp).

### Requirements

- Java for Elasticsearch
- running Elasticsearch instance on default settings (localhost:9200)
- Node.js (and npm)
- running MongoDB instance on default settings (localhost:27017)

### Install

Check out repo
```
git clone https://github.com/martinpetrasch/mongoose-elastic-test.git
```

Change working directory
```
cd mongoose-elastic-test
```

Install all dependencies
```
npm install
```

### Running

Make sure you don't have a mapping on *pages* or *books* in elasticsearch and no *books* and *pages* collection in MongoDB.

Clear *books* mapping with:
```
curl -XDELETE localhost:9200/books
```

Clear *pages* mapping with:
```
curl -XDELETE localhost:9200/pages
```

Run the example:
```
node index.js
```

Now check mapping:
```
curl -XGET localhost:9200/books?pretty
```

This is the output:
```

  "books" : {
    "aliases" : { },
    "mappings" : {
      "book" : {
        "properties" : {
          "pages" : {
            "properties" : {
              "number" : {
                "type" : "long"
              },
              "text" : {
                "type" : "text",
                "fields" : {
                  "keyword" : {
                    "type" : "keyword",
                    "ignore_above" : 256
                  }
                }
              }
            }
          },
          "title" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          }
        }
      }
    },
    "settings" : {
     ...
    }
  }
}
```

But *pages* should be **type:nested**.

Without *type:nested* I'm unable to retrieve the subdocument from search on *books*, because it will return the whole *book*-document with all subdocuments.
