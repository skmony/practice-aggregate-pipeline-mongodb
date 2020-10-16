  //////////////////////////////////////////////////////////////////////////
  // Data
  //////////////////////////////////////////////////////////////////////////
  db.artwork.insertMany([
{ "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,"price" : NumberDecimal("199.99"),"tags" : [ "painting", "satire", "Expressionism", "caricature" ] },
{ "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,"price" : NumberDecimal("280.00"),"tags" : [ "woodcut", "Expressionism" ] },
{ "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,"price" : NumberDecimal("76.04"),"tags" : [ "oil", "Surrealism", "painting" ] },
{ "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai","price" : NumberDecimal("167.30"),"tags" : [ "woodblock", "ukiyo-e" ] },
{ "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,"price" : NumberDecimal("483.00"),"tags" : [ "Surrealism", "painting", "oil" ] },
{ "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,"price" : NumberDecimal("385.00"),"tags" : [ "oil", "painting", "abstract" ] },
{ "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893,"tags" : [ "Expressionism", "painting", "oil" ] },
{ "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,"price" : NumberDecimal("118.42"),"tags" : [ "abstract", "painting" ] }
])

  //////////////////////////////////////////////////////////////////////////
  // Result
  //////////////////////////////////////////////////////////////////////////


db.artwork.aggregate( [
    {
      $facet: {
        "categorizedByTags": [
          { $unwind: "$tags" },
          { $sortByCount: "$tags" }
        ],
        "categorizedByPrice": [
          // Filter out documents without a price e.g., _id: 7
          { $match: { price: { $exists: 1 } } },
          {
            $bucket: {
              groupBy: "$price",
              boundaries: [  0, 150, 200, 300, 400 ],
              default: "Other",
              output: {
                "count": { $sum: 1 },
                "titles": { $push: "$title" }
              }
            }
          }
        ],
        "categorizedByYears(Auto)": [
          {
            $bucketAuto: {
              groupBy: "$year",
              buckets: 4
            }
          }
        ]
      }
    }
  ])

  //////////////////////////////////////////////////////////////////////////
  // Result
  //////////////////////////////////////////////////////////////////////////

  result={
    "categorizedByTags" : [
            {
                    "_id" : "painting",
                    "count" : 6
            },
            {
                    "_id" : "oil",
                    "count" : 4
            },
            {
                    "_id" : "Expressionism",
                    "count" : 3
            },
            {
                    "_id" : "Surrealism",
                    "count" : 2
            },
            {
                    "_id" : "abstract",
                    "count" : 2
            },
            {
                    "_id" : "ukiyo-e",
                    "count" : 1
            },
            {
                    "_id" : "woodcut",
                    "count" : 1
            },
            {
                    "_id" : "satire",
                    "count" : 1
            },
            {
                    "_id" : "caricature",
                    "count" : 1
            },
            {
                    "_id" : "woodblock",
                    "count" : 1
            }
    ],
    "categorizedByPrice" : [
            {
                    "_id" : 0,
                    "count" : 2,
                    "titles" : [
                            "Dancer",
                            "Blue Flower"
                    ]
            },
            {
                    "_id" : 150,
                    "count" : 2,
                    "titles" : [
                            "The Pillars of Society",
                            "The Great Wave off Kanagawa"
                    ]
            },
            {
                    "_id" : 200,
                    "count" : 1,
                    "titles" : [
                            "Melancholy III"
                    ]
            },
            {
                    "_id" : 300,
                    "count" : 1,
                    "titles" : [
                            "Composition VII"
                    ]
            },
            {
                    "_id" : "Other",
                    "count" : 1,
                    "titles" : [
                            "The Persistence of Memory"
                    ]
            }
    ],
    "categorizedByYears(Auto)" : [
            {
                    "_id" : {
                            "min" : null,
                            "max" : 1902
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : 1902,
                            "max" : 1918
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : 1918,
                            "max" : 1926
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : 1926,
                            "max" : 1931
                    },
                    "count" : 2
            }
    ]
}