db.orders.insert([
   { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
   { "_id" : 3  }
])


db.inventory.insert([
   { "_id" : 1, "sku" : { "_id" : 1, "item" :"almonds"}, "description": "product 1", "instock" : 120 },
   { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
   { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
   { "_id" : 4, "sku" : { "_id" : 2, "item" : "pecans"}, "description": "product 4", "instock" : 70 },
   { "_id" : 5, "sku": { "_id" : 2, "item" : "pecans"}, "description": "Incomplete" },
   { "_id" : 6 }
])

db.classes.insert( [
    { _id: 1, title: "Reading is ...", enrollmentlist: [ "giraffe2", "pandabear", "artie" ], days: ["M", "W", "F"] },
    { _id: 2, title: "But Writing ...", enrollmentlist: [ "giraffe1", "artie" ], days: ["T", "F"] }
 ])

 db.members.insert( [
    { _id: 1, name: "artie", joined: new Date("2016-05-01"), status: "A" },
    { _id: 2, name: "giraffe", joined: new Date("2017-05-01"), status: "D" },
    { _id: 3, name: "giraffe1", joined: new Date("2017-10-01"), status: "A" },
    { _id: 4, name: "panda", joined: new Date("2018-10-11"), status: "A" },
    { _id: 5, name: "pandabear", joined: new Date("2018-12-01"), status: "A" },
    { _id: 6, name: "giraffe2", joined: new Date("2018-12-01"), status: "D" }
 ])

 db.orders.insert([
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
 ])

 db.items.insert([
    { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
    { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
    { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
  ])

  db.absences.insert([
    { "_id" : 1, "student" : "Ann Aardvark", sickdays: [ new Date ("2018-05-01"),new Date ("2018-08-23") ] },
    { "_id" : 2, "student" : "Zoe Zebra", sickdays: [ new Date ("2018-02-01"),new Date ("2018-05-23") ] },
 ])

 db.holidays.insert([
    { "_id" : 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
    { "_id" : 2, year: 2018, name: "Pi Day", date: new Date("2018-03-14") },
    { "_id" : 3, year: 2018, name: "Ice Cream Day", date: new Date("2018-07-15") },
    { "_id" : 4, year: 2017, name: "New Years", date: new Date("2017-01-01") },
    { "_id" : 5, year: 2017, name: "Ice Cream Day", date: new Date("2017-07-16") }
 ])

db.orders.aggregate([
    {
      $lookup:
        {
          from: "inventory",
          localField: "_id",
          foreignField: "sku._id",
          as: "inventory_docs"
        }
   }
 ])


 result=[{
    "_id" : 1,
    "item" : "almonds",
    "price" : 12,
    "quantity" : 2,
    "inventory_docs" : [
            {
                    "_id" : 1,
                    "sku" : {
                            "_id" : 1,
                            "item" : "almonds"
                    },
                    "description" : "product 1",
                    "instock" : 120
            }
    ]
},
{
    "_id" : 2,
    "item" : "pecans",
    "price" : 20,
    "quantity" : 1,
    "inventory_docs" : [
            {
                    "_id" : 4,
                    "sku" : {
                            "_id" : 2,
                            "item" : "pecans"
                    },
                    "description" : "product 4",
                    "instock" : 70
            }
    ]
},
{ "_id" : 3, "inventory_docs" : [ ] }]


db.classes.aggregate([
    {
       $lookup:
          {
             from: "members",
             localField: "enrollmentlist",
             foreignField: "name",
             as: "enrollee_info"
         }
    }
 ])


result=[{
    "_id" : 1,
    "title" : "Reading is ...",
    "enrollmentlist" : [
            "giraffe2",
            "pandabear",
            "artie"
    ],
    "days" : [
            "M",
            "W",
            "F"
    ],
    "enrollee_info" : [
            {
                    "_id" : 1,
                    "name" : "artie",
                    "joined" : ISODate("2016-05-01T00:00:00Z"),
                    "status" : "A"
            },
            {
                    "_id" : 5,
                    "name" : "pandabear",
                    "joined" : ISODate("2018-12-01T00:00:00Z"),
                    "status" : "A"
            },
            {
                    "_id" : 6,
                    "name" : "giraffe2",
                    "joined" : ISODate("2018-12-01T00:00:00Z"),
                    "status" : "D"
            }
    ]
},
{
    "_id" : 2,
    "title" : "But Writing ...",
    "enrollmentlist" : [
            "giraffe1",
            "artie"
    ],
    "days" : [
            "T",
            "F"
    ],
    "enrollee_info" : [
            {
                    "_id" : 1,
                    "name" : "artie",
                    "joined" : ISODate("2016-05-01T00:00:00Z"),
                    "status" : "A"
            },
            {
                    "_id" : 3,
                    "name" : "giraffe1",
                    "joined" : ISODate("2017-10-01T00:00:00Z"),
                    "status" : "A"
            }
    ]
}]



db.orders.aggregate([
    {
       $lookup: {
          from: "items",
          localField: "item",    // field in the orders collection
          foreignField: "item",  // field in the items collection
          as: "fromItems"
       }
    },
    {
       $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
    },
    { $project: { fromItems: 0 } }
 ]).pretty()


 result=[{
    "_id" : 1,
    "item" : "almonds",
    "description" : "almond clusters",
    "instock" : 120,
    "price" : 12,
    "quantity" : 2
},
{
    "_id" : 2,
    "item" : "pecans",
    "description" : "candied pecans",
    "instock" : 60,
    "price" : 20,
    "quantity" : 1
}]



db.orders.aggregate([
    {
       $lookup:
          {
            from: "warehouses",
            let: { order_item: "$item", order_qty: "$ordered" },
            pipeline: [
               { $match:
                  { $expr:
                     { $and:
                        [
                          { $eq: [ "$stock_item",  "$$order_item" ] },
                          { $gte: [ "$instock", "$$order_qty" ] }
                        ]
                     }
                  }
               },
               { $project: { stock_item: 0, _id: 0 } }
            ],
            as: "stockdata"
          }
     }
 ])


result=[{ "_id" : 1, "item" : "almonds", "price" : 12, "ordered" : 2, "stockdata" : [ { "warehouse" : "A", "instock" : 120 }, { "warehouse" : "B", "instock" : 60 } ] },
{ "_id" : 2, "item" : "pecans", "price" : 20, "ordered" : 1, "stockdata" : [ { "warehouse" : "A", "instock" : 80 } ] },
{ "_id" : 3, "item" : "cookies", "price" : 10, "ordered" : 60, "stockdata" : [ { "warehouse" : "A", "instock" : 80 } ] }]



db.absences.aggregate([
    {
       $lookup:
          {
            from: "holidays",
            pipeline: [
               { $match: { year: 2018 } },
               { $project: { _id: 0, date: { name: "$name", date: "$date" } } },
               { $replaceRoot: { newRoot: "$date" } }
            ],
            as: "holidays"
          }
     }
 ])


 result =[{
    "_id" : 1,
    "student" : "Ann Aardvark",
    "sickdays" : [
            ISODate("2018-05-01T00:00:00Z"),
            ISODate("2018-08-23T00:00:00Z")
    ],
    "holidays" : [
            {
                    "name" : "New Years",
                    "date" : ISODate("2018-01-01T00:00:00Z")
            },
            {
                    "name" : "Pi Day",
                    "date" : ISODate("2018-03-14T00:00:00Z")
            },
            {
                    "name" : "Ice Cream Day",
                    "date" : ISODate("2018-07-15T00:00:00Z")
            }
    ]
},
{
    "_id" : 2,
    "student" : "Zoe Zebra",
    "sickdays" : [
            ISODate("2018-02-01T00:00:00Z"),
            ISODate("2018-05-23T00:00:00Z")
    ],
    "holidays" : [
            {
                    "name" : "New Years",
                    "date" : ISODate("2018-01-01T00:00:00Z")
            },
            {
                    "name" : "Pi Day",
                    "date" : ISODate("2018-03-14T00:00:00Z")
            },
            {
                    "name" : "Ice Cream Day",
                    "date" : ISODate("2018-07-15T00:00:00Z")
            }
    ]
}]