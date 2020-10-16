  //////////////////////////////////////////////////////////////////////////
  // Data
  //////////////////////////////////////////////////////////////////////////

db.artists.insertMany([
    { "_id" : 1, "last_name" : "Bernard", "first_name" : "Emil", "year_born" : 1868, "year_died" : 1941, "nationality" : "France" },
    { "_id" : 2, "last_name" : "Rippl-Ronai", "first_name" : "Joszef", "year_born" : 1861, "year_died" : 1927, "nationality" : "Hungary" },
    { "_id" : 3, "last_name" : "Ostroumova", "first_name" : "Anna", "year_born" : 1871, "year_died" : 1955, "nationality" : "Russia" },
    { "_id" : 4, "last_name" : "Van Gogh", "first_name" : "Vincent", "year_born" : 1853, "year_died" : 1890, "nationality" : "Holland" },
    { "_id" : 5, "last_name" : "Maurer", "first_name" : "Alfred", "year_born" : 1868, "year_died" : 1932, "nationality" : "USA" },
    { "_id" : 6, "last_name" : "Munch", "first_name" : "Edvard", "year_born" : 1863, "year_died" : 1944, "nationality" : "Norway" },
    { "_id" : 7, "last_name" : "Redon", "first_name" : "Odilon", "year_born" : 1840, "year_died" : 1916, "nationality" : "France" },
    { "_id" : 8, "last_name" : "Diriks", "first_name" : "Edvard", "year_born" : 1855, "year_died" : 1930, "nationality" : "Norway" }
  ])


  db.artwork.insertMany([
    { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926, "price" : NumberDecimal("199.99") },
    { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902, "price" : NumberDecimal("280.00") },
    { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,"price" : NumberDecimal("76.04") },
    { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai","price" : NumberDecimal("167.30") },
    { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,"price" : NumberDecimal("483.00") },
    { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,"price" : NumberDecimal("385.00") },
    { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893/* No price*/ },
    { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,"price" : NumberDecimal("118.42") }
  ])


  //////////////////////////////////////////////////////////////////////////
  // Query
  //////////////////////////////////////////////////////////////////////////

db.artists.aggregate( [
    // First Stage
    {
      $bucket: {
        groupBy: "$year_born",                        // Field to group by
        boundaries: [ 1840, 1850, 1860, 1870, 1880 ], // Boundaries for the buckets
        default: "Other",                             // Bucket id for documents which do not fall into a bucket
        output: {                                     // Output for each bucket
          "count": { $sum: 1 },
          "artists" :
            {
              $push: {
                "name": { $concat: [ "$first_name", " ", "$last_name"] },
                "year_born": "$year_born"
              }
            }
        }
      }
    },
    
    
  ] ).pretty()



  //////////////////////////////////////////////////////////////////////////
  // RESULTS
  //////////////////////////////////////////////////////////////////////////


  result=[{
    "_id" : 1840,
    "count" : 1,
    "artists" : [
            {
                    "name" : "Odilon Redon",
                    "year_born" : 1840
            }
    ]
},
{
    "_id" : 1850,
    "count" : 2,
    "artists" : [
            {
                    "name" : "Vincent Van Gogh",
                    "year_born" : 1853
            },
            {
                    "name" : "Edvard Diriks",
                    "year_born" : 1855
            }
    ]
},
{
    "_id" : 1860,
    "count" : 4,
    "artists" : [
            {
                    "name" : "Emil Bernard",
                    "year_born" : 1868
            },
            {
                    "name" : "Joszef Rippl-Ronai",
                    "year_born" : 1861
            },
            {
                    "name" : "Alfred Maurer",
                    "year_born" : 1868
            },
            {
                    "name" : "Edvard Munch",
                    "year_born" : 1863
            }
    ]
},
{
    "_id" : 1870,
    "count" : 1,
    "artists" : [
            {
                    "name" : "Anna Ostroumova",
                    "year_born" : 1871
            }
    ]
}]


  //////////////////////////////////////////////////////////////////////////
  // Query
  //////////////////////////////////////////////////////////////////////////


db.artists.aggregate( [
    // First Stage
    {
      $bucket: {
        groupBy: "$year_born",                        // Field to group by
        boundaries: [ 1840, 1850, 1860, 1870, 1880 ], // Boundaries for the buckets
        default: "Other",                             // Bucket id for documents which do not fall into a bucket
        output: {                                     // Output for each bucket
          "count": { $sum: 1 },
          "artists" :
            {
              $push: {
                "name": { $concat: [ "$first_name", " ", "$last_name"] },
                "year_born": "$year_born"
              }
            }
        }
      }
    },
    // Second Stage
    {
      $match: { count: {$gt: 3} }
    }
  ] ).pretty()

   //////////////////////////////////////////////////////////////////////////
  // Results
  //////////////////////////////////////////////////////////////////////////


  result={
    "_id" : 1860,
    "count" : 4,
    "artists" : [
            {
                    "name" : "Emil Bernard",
                    "year_born" : 1868
            },
            {
                    "name" : "Joszef Rippl-Ronai",
                    "year_born" : 1861
            },
            {
                    "name" : "Alfred Maurer",
                    "year_born" : 1868
            },
            {
                    "name" : "Edvard Munch",
                    "year_born" : 1863
            }
    ]
}

   //////////////////////////////////////////////////////////////////////////
  // Query
  //////////////////////////////////////////////////////////////////////////




db.artwork.aggregate( [
    {
      $facet: {                               // Top-level $facet stage
        "price": [                            // Output field 1
          {
            $bucket: {
                groupBy: "$price",            // Field to group by
                boundaries: [ 0, 200, 400 ],  // Boundaries for the buckets
                default: "Other",             // Bucket id for documents which do not fall into a bucket
                output: {                     // Output for each bucket
                  "count": { $sum: 1 },
                  "artwork" : { $push: { "title": "$title", "price": "$price" } },
                  "averagePrice": { $avg: "$price" }
                }
            }
          }
        ],
        "year": [                                      // Output field 2
          {
            $bucket: {
              groupBy: "$year",                        // Field to group by
              boundaries: [ 1890, 1910, 1920, 1940 ],  // Boundaries for the buckets
              default: "Unknown",                      // Bucket id for documents which do not fall into a bucket
              output: {                                // Output for each bucket
                "count": { $sum: 1 },
                "artwork": { $push: { "title": "$title", "year": "$year" } }
              }
            }
          }
        ]
      }
    }
  ] ).pretty()

//////////////////////////////////////////////////////////////////////////
// Results
//////////////////////////////////////////////////////////////////////////


  result={
    "price" : [
            {
                    "_id" : 0,
                    "count" : 4,
                    "artwork" : [
                            {
                                    "title" : "The Pillars of Society",
                                    "price" : NumberDecimal("199.99")
                            },
                            {
                                    "title" : "Dancer",
                                    "price" : NumberDecimal("76.04")
                            },
                            {
                                    "title" : "The Great Wave off Kanagawa",
                                    "price" : NumberDecimal("167.30")
                            },
                            {
                                    "title" : "Blue Flower",
                                    "price" : NumberDecimal("118.42")
                            }
                    ],
                    "averagePrice" : NumberDecimal("140.4375")
            },
            {
                    "_id" : 200,
                    "count" : 2,
                    "artwork" : [
                            {
                                    "title" : "Melancholy III",
                                    "price" : NumberDecimal("280.00")
                            },
                            {
                                    "title" : "Composition VII",
                                    "price" : NumberDecimal("385.00")
                            }
                    ],
                    "averagePrice" : NumberDecimal("332.50")
            },
            {
                    "_id" : "Other",
                    "count" : 2,
                    "artwork" : [
                            {
                                    "title" : "The Persistence of Memory",
                                    "price" : NumberDecimal("483.00")
                            },
                            {
                                    "title" : "The Scream"
                            }
                    ],
                    "averagePrice" : NumberDecimal("483.00")
            }
    ],
    "year" : [
            {
                    "_id" : 1890,
                    "count" : 2,
                    "artwork" : [
                            {
                                    "title" : "Melancholy III",
                                    "year" : 1902
                            },
                            {
                                    "title" : "The Scream",
                                    "year" : 1893
                            }
                    ]
            },
            {
                    "_id" : 1910,
                    "count" : 2,
                    "artwork" : [
                            {
                                    "title" : "Composition VII",
                                    "year" : 1913
                            },
                            {
                                    "title" : "Blue Flower",
                                    "year" : 1918
                            }
                    ]
            },
            {
                    "_id" : 1920,
                    "count" : 3,
                    "artwork" : [
                            {
                                    "title" : "The Pillars of Society",
                                    "year" : 1926
                            },
                            {
                                    "title" : "Dancer",
                                    "year" : 1925
                            },
                            {
                                    "title" : "The Persistence of Memory",
                                    "year" : 1931
                            }
                    ]
            },
            {
                    "_id" : "Unknown",
                    "count" : 1,
                    "artwork" : [
                            {
                                    "title" : "The Great Wave off Kanagawa"
                            }
                    ]
            }
    ]
}