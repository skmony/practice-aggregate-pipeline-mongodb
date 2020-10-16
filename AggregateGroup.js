
  //////////////////////////////////////////////////////////////////////////
  // Data
  //////////////////////////////////////////////////////////////////////////

db.sales.insertMany([
  { "_id" : 1, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("2"), "date" : ISODate("2014-03-01T08:00:00Z") },
  { "_id" : 2, "item" : "jkl", "price" : NumberDecimal("20"), "quantity" : NumberInt("1"), "date" : ISODate("2014-03-01T09:00:00Z") },
  { "_id" : 3, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" : NumberInt( "10"), "date" : ISODate("2014-03-15T09:00:00Z") },
  { "_id" : 4, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" :  NumberInt("20") , "date" : ISODate("2014-04-04T11:21:39.736Z") },
  { "_id" : 5, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("10") , "date" : ISODate("2014-04-04T21:23:13.331Z") },
  { "_id" : 6, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("5" ) , "date" : ISODate("2015-06-04T05:08:13Z") },
  { "_id" : 7, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("10") , "date" : ISODate("2015-09-10T08:43:00Z") },
  { "_id" : 8, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("5" ) , "date" : ISODate("2016-02-06T20:20:13Z") },
])


db.books.insertMany([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
  ])

  //////////////////////////////////////////////////////////////////////////
  // Query
  //////////////////////////////////////////////////////////////////////////

// Similar to : SELECT COUNT(*) AS count FROM sales

db.sales.aggregate( [
    {
      $group: {
         _id: null,
         count: { $sum: 1 }
      }
    }
  ] )


  result={ "_id" : null, "count" : 8 }

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////


db.sales.aggregate( [ { $group : { _id : "$item" } } ] )

//////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////

result=
[{ "_id" : "abc" },
{ "_id" : "jkl" },
{ "_id" : "def" },
{ "_id" : "xyz" }]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////


db.sales.aggregate( [ { $group : { _id : "$item",count:{$sum:1} } } ] )
//////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////
result=[{ "_id" : "abc", "count" : 3 },
{ "_id" : "jkl", "count" : 1 },
{ "_id" : "xyz", "count" : 2 },
{ "_id" : "def", "count" : 2 }]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////

db.sales.aggregate(
    [
      // First Stage
      {
        $group :
          {
            _id : "$item",
            totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } }
          }
       },
       // Second Stage
       {
         $match: { "totalSaleAmount": { $gte: 100 } }
       }
     ]
   )
//////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////
   result=[{ "_id" : "xyz", "totalSaleAmount" : NumberDecimal("150") },
   { "_id" : "def", "totalSaleAmount" : NumberDecimal("112.5") },
   { "_id" : "abc", "totalSaleAmount" : NumberDecimal("170") }]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////


   db.sales.aggregate([
    // First Stage
    {
      $match : { "date": { $gte: new ISODate("2014-01-01"), $lt: new ISODate("2015-01-01") } }
    },
    // Second Stage
    {
      $group : {
         _id : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
         averageQuantity: { $avg: "$quantity" },
         count: { $sum: 1 }
      }
    },
    // Third Stage
    {
      $sort : { totalSaleAmount: -1 }
    }
   ])
//////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////
result=[{ "_id" : "2014-04-04", "totalSaleAmount" : NumberDecimal("200"), "averageQuantity" : 15, "count" : 2 },
{ "_id" : "2014-03-15", "totalSaleAmount" : NumberDecimal("50"), "averageQuantity" : 10, "count" : 1 },
{ "_id" : "2014-03-01", "totalSaleAmount" : NumberDecimal("40"), "averageQuantity" : 1.5, "count" : 2 }]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////


/**
 * Similar too : 
 * 
 * SELECT Sum(price * quantity) AS totalSaleAmount,
       Avg(quantity)         AS averageQuantity,
       Count(*)              AS Count
       FROM   sales
 * 
 */
db.sales.aggregate([
    {
      $group : {
         _id : null,
         totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
         averageQuantity: { $avg: "$quantity" },
         count: { $sum: 1 }
      }
    }
   ])

   result={ "_id" : null, "totalSaleAmount" : NumberDecimal("452.5"), "averageQuantity" : 7.875, "count" : 8 }



//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////


   db.books.aggregate([
    { $group : { _id : "$author", books: { $push: "$title" } } }
  ])
  //////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////

  result=[{ "_id" : "Homer", "books" : [ "The Odyssey", "Iliad" ] },
  { "_id" : "Dante", "books" : [ "The Banquet", "Divine Comedy", "Eclogues" ] }]

//////////////////////////////////////////////////////////////////////////
// Query
//////////////////////////////////////////////////////////////////////////

  db.books.aggregate([
    // First Stage
    {
      $group : { _id : "$author", books: { $push: "$$ROOT" } }
    },
    // Second Stage
    {
      $addFields:
        {
          totalCopies : { $sum: "$books.copies" }
        }
    }
  ]).pretty()


//////////////////////////////////////////////////////////////////////////
// Result
//////////////////////////////////////////////////////////////////////////


  result=[{
    "_id" : "Homer",
    "books" : [
            {
                    "_id" : 7000,
                    "title" : "The Odyssey",
                    "author" : "Homer",
                    "copies" : 10
            },
            {
                    "_id" : 7020,
                    "title" : "Iliad",
                    "author" : "Homer",
                    "copies" : 10
            }
    ],
    "totalCopies" : 20
},
{
    "_id" : "Dante",
    "books" : [
            {
                    "_id" : 8751,
                    "title" : "The Banquet",
                    "author" : "Dante",
                    "copies" : 2
            },
            {
                    "_id" : 8752,
                    "title" : "Divine Comedy",
                    "author" : "Dante",
                    "copies" : 1
            },
            {
                    "_id" : 8645,
                    "title" : "Eclogues",
                    "author" : "Dante",
                    "copies" : 2
            }
    ],
    "totalCopies" : 5
}]