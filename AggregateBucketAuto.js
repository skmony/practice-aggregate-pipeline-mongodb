  //////////////////////////////////////////////////////////////////////////
  // Data
  //////////////////////////////////////////////////////////////////////////

db.artwork.insertMany([
{ "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,"price" : NumberDecimal("199.99"),"dimensions" : { "height" : 39, "width" : 21, "units" : "in" } },
{ "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,"price" : NumberDecimal("280.00"),"dimensions" : { "height" : 49, "width" : 32, "units" : "in" } },
{ "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,"price" : NumberDecimal("76.04"),"dimensions" : { "height" : 25, "width" : 20, "units" : "in" } },
{ "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai","price" : NumberDecimal("167.30"),"dimensions" : { "height" : 24, "width" : 36, "units" : "in" } },
{ "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,"price" : NumberDecimal("483.00"),"dimensions" : { "height" : 20, "width" : 24, "units" : "in" } },
{ "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,"price" : NumberDecimal("385.00"),"dimensions" : { "height" : 30, "width" : 46, "units" : "in" } },
{ "_id" : 7, "title" : "The Scream", "artist" : "Munch","price" : NumberDecimal("159.00"),"dimensions" : { "height" : 24, "width" : 18, "units" : "in" } },
{ "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,"price" : NumberDecimal("118.42"),"dimensions" : { "height" : 24, "width" : 20, "units" : "in" } }
])


 //////////////////////////////////////////////////////////////////////////
 // Query
 //////////////////////////////////////////////////////////////////////////

 db.artwork.aggregate( [
    {
      $bucketAuto: {
          groupBy: "$price",
          buckets: 4,
          output:{
              "count":{$sum:1},
              "artwork":{
                  $push:{
                      "title":"$title",
                      "artist":"$artist",
                      "year":"$year",
                      "price":"$price"
                  }
              }
          }
      }
    }
 ] ).pretty()


  //////////////////////////////////////////////////////////////////////////
  // Result
  //////////////////////////////////////////////////////////////////////////

  result=[{
    "_id" : {
            "min" : NumberDecimal("76.04"),
            "max" : NumberDecimal("159.00")
    },
    "count" : 2,
    "artwork" : [
            {
                    "title" : "Dancer",
                    "artist" : "Miro",
                    "year" : 1925,
                    "price" : NumberDecimal("76.04")
            },
            {
                    "title" : "Blue Flower",
                    "artist" : "O'Keefe",
                    "year" : 1918,
                    "price" : NumberDecimal("118.42")
            }
    ]
},
{
    "_id" : {
            "min" : NumberDecimal("159.00"),
            "max" : NumberDecimal("199.99")
    },
    "count" : 2,
    "artwork" : [
            {
                    "title" : "The Scream",
                    "artist" : "Munch",
                    "price" : NumberDecimal("159.00")
            },
            {
                    "title" : "The Great Wave off Kanagawa",
                    "artist" : "Hokusai",
                    "price" : NumberDecimal("167.30")
            }
    ]
},
{
    "_id" : {
            "min" : NumberDecimal("199.99"),
            "max" : NumberDecimal("385.00")
    },
    "count" : 2,
    "artwork" : [
            {
                    "title" : "The Pillars of Society",
                    "artist" : "Grosz",
                    "year" : 1926,
                    "price" : NumberDecimal("199.99")
            },
            {
                    "title" : "Melancholy III",
                    "artist" : "Munch",
                    "year" : 1902,
                    "price" : NumberDecimal("280.00")
            }
    ]
},
{
    "_id" : {
            "min" : NumberDecimal("385.00"),
            "max" : NumberDecimal("483.00")
    },
    "count" : 2,
    "artwork" : [
            {
                    "title" : "Composition VII",
                    "artist" : "Kandinsky",
                    "year" : 1913,
                    "price" : NumberDecimal("385.00")
            },
            {
                    "title" : "The Persistence of Memory",
                    "artist" : "Dali",
                    "year" : 1931,
                    "price" : NumberDecimal("483.00")
            }
    ]
}]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////

db.artwork.aggregate( [
    {
      $facet: {
        "price": [
          {
            $bucketAuto: {
              groupBy: "$price",
              buckets: 4
            }
          }
        ],
        "year": [
          {
            $bucketAuto: {
              groupBy: "$year",
              buckets: 3,
              output: {
                "count": { $sum: 1 },
                "years": { $push: "$year" }
              }
            }
          }
        ],
        "area": [
          {
            $bucketAuto: {
              groupBy: {
                $multiply: [ "$dimensions.height", "$dimensions.width" ]
              },
              buckets: 4,
              output: {
                "count": { $sum: 1 },
                "titles": { $push: "$title" }
              }
            }
          }
        ]
      }
    }
  ] )


  //////////////////////////////////////////////////////////////////////////
  // Result
  //////////////////////////////////////////////////////////////////////////


  result={
    "price" : [
            {
                    "_id" : {
                            "min" : NumberDecimal("76.04"),
                            "max" : NumberDecimal("159.00")
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : NumberDecimal("159.00"),
                            "max" : NumberDecimal("199.99")
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : NumberDecimal("199.99"),
                            "max" : NumberDecimal("385.00")
                    },
                    "count" : 2
            },
            {
                    "_id" : {
                            "min" : NumberDecimal("385.00"),
                            "max" : NumberDecimal("483.00")
                    },
                    "count" : 2
            }
    ],
    "year" : [
            {
                    "_id" : {
                            "min" : null,
                            "max" : 1913
                    },
                    "count" : 3,
                    "years" : [
                            1902
                    ]
            },
            {
                    "_id" : {
                            "min" : 1913,
                            "max" : 1926
                    },
                    "count" : 3,
                    "years" : [
                            1913,
                            1918,
                            1925
                    ]
            },
            {
                    "_id" : {
                            "min" : 1926,
                            "max" : 1931
                    },
                    "count" : 2,
                    "years" : [
                            1926,
                            1931
                    ]
            }
    ],
    "area" : [
            {
                    "_id" : {
                            "min" : 432,
                            "max" : 500
                    },
                    "count" : 3,
                    "titles" : [
                            "The Scream",
                            "The Persistence of Memory",
                            "Blue Flower"
                    ]
            },
            {
                    "_id" : {
                            "min" : 500,
                            "max" : 864
                    },
                    "count" : 2,
                    "titles" : [
                            "Dancer",
                            "The Pillars of Society"
                    ]
            },
            {
                    "_id" : {
                            "min" : 864,
                            "max" : 1568
                    },
                    "count" : 2,
                    "titles" : [
                            "The Great Wave off Kanagawa",
                            "Composition VII"
                    ]
            },
            {
                    "_id" : {
                            "min" : 1568,
                            "max" : 1568
                    },
                    "count" : 1,
                    "titles" : [
                            "Melancholy III"
                    ]
            }
    ]
}