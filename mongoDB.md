# mongoDB

Hu`mongo`us database

In a db, you have collections, which can store schemaless (some data might be incomplete, documents can have different structure) documents or documents with a schema (validator) in BSON format

You are responsible for organizing the schemaless documents

It's very efficient for apps that have a huge IO workload

Highly efficient, because you can store multiple data in a logical way, not needing to join them like in a SQL db

## Installation

[Check docs](https://www.mongodb.com/docs/manual/installation/)

`Important`

```javascript
The mongodb package provided by Debian is not maintained by MongoDB Inc. and conflicts with the official mongodb-org package. If you have already installed the mongodb package on your Debian system, you must first uninstall the mongodb package before proceeding with these instructions
```

The data directory `/var/lib/mongodb` and the log directory `/var/log/mongodb` are created during the installation

Reset it by starting db with:

```bash
mongod --dbpath <path> --logpath <path>/file-name.log
```

### ulimit considerations

Most Unix-like operating systems limit the system resources that a process may use

These limits may negatively impact MongoDB operation, and should be adjusted

[See UNIX ulimit Settings for Self-Managed Deployments for the recommended settings for your platform](https://www.mongodb.com/docs/manual/reference/ulimit/)

#### Recommended settings

```bash
isaac soft fsize unlimited
isaac hard fsize unlimited

isaac soft cpu unlimited
isaac hard cpu unlimited

isaac soft as unlimited
isaac hard as unlimited

isaac soft memlock unlimited
isaac hard memlock unlimited

isaac soft nofile 64000
isaac hard nofile 64000

isaac soft rss unlimited
isaac hard rss unlimited

isaac soft nproc 64000
isaac hard nproc 64000
```

## Starting mongodb server

`mongod` daemon; the server

`mongosh` mongo shell

## Working with mongoDB

A database can have many collections

Each collection can have many documents

A document is the peace of data stored

Structure

![Collections framework](working-with-mongodb.png)

A closer look

![A closer look](a-closer-look.png)

## JSON vs BSON

You write JSON, but the driver converts and store it in BSON

It has a binary data

It extends JSON types, for example more detailed number types or date type

It has an efficient storage

## Crud operations

![alt text](image-3.png)

Don't use `.update`, use `updateOne` instead

`.update` replaces the data if you don't use the update keywords

`.find()` returns a `Cursor` object containing the data

When querying an array, you can pass just the value you want, for example:

```javascript
db.passengers.find()
{
    name: "John",
    hobbies: ["cooking", "cleaning"]
}
...
db.passenger.find({hobbies: "cleaning"})
```

If the array elements are objects, you have to specify all the object or use `$elemMatch` to specify one field of the object

## Projection

> By default, queries in MongoDB return all fields in matching documents

> To limit the amount of data that MongoDB sends to applications, you can include a `projection` document to specify or restrict fields to return

It filters the query in the db itself, so that less data is sent over the wire

The field `_id` is included in all queries. To exclude it, you have to explicit remove with the help from the projection

## Data types

- Text
  - Max size is 16 mB
- Boolean
- Number
  - int32 (+-2,147,483,647) [NumberInt(number)]
  - int64 (+-9,223,372,036,854,775,807) [NumberLong(number)]
  - NumberDecimal
- ObjectId
- ISODate
- Timestamp
- Array
- Embedded document

## Types of relation

### One to one

Prefer embedded documents

### One to many

Two possibilities

- Embedded documents
- Different collection with references

### Many to many

- Embedded documents if duplication is fine
- Different collection with references

## Data modelling and structuring

- In which format will you fetch your Data?
- How often will you fetch and change your Data?
- How much data will you save?
- How is your Data related?
- Will duplicates hurt you?
- Will you hit storage limits? (16 mB / 100 levels)

## Schema validation

- validationLevel
  - It defines what is validated
  - strict or moderate
- validationAction
  - It defines what happens when something (insertion, update) fails
  - log a warn or throws an error

```javascript
db.createCollection('shipping', {
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			title: 'Shipping Country Validation',
			required: ['storeLocation', 'comments'],
			properties: {
				country: {
					enum: ['France', 'United Kingdom', 'United States'],
					description:
						'Must be either France, United Kingdom, or United States',
				},
				storeLocation: {
					bsonType: 'string',
					description: 'Must be a string',
				},
				comments: {
					bsonType: 'array',
					description: 'must be an array',
					items: {
						bsonType: 'object',
						required: ['text', 'author'],
						properties: {
							text: {
								bsonType: 'string',
								description: 'Must be a string',
							},
							author: {
								bsonType: 'objectId',
								description: 'must be an objectId',
							},
						},
					},
				},
			},
		},
	},
});
```

### Change existing validation

```javascript
db.runCommand({
	collMod: 'posts',
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			title: 'Shipping Country Validation',
			required: ['comments'],
			properties: {
				country: {
					enum: [
						'France',
						'United Kingdom',
						'United States',
						'Brazil',
						'Venezuela',
						'Ecuador',
					],
					description:
						'Must be either France, United Kingdom, or United States',
				},
				comments: {
					bsonType: 'array',
					description: 'must be an array',
					items: {
						bsonType: 'object',
						required: ['text', 'author'],
						properties: {
							text: {
								bsonType: 'string',
								description: 'Must be a string',
							},
							author: {
								bsonType: 'objectId',
								description: 'must be an objectId',
							},
						},
					},
				},
			},
		},
	},
	validationLevel: 'warn',
});
```

- Remember to set `validationLevel` either to `warn` or `error`

## Create operation

### `ordered: false`

For `insertMany([], options)`, if there is an error, all the inserted documents remain inserted (no rollback), then the next ones are aborted

You can change this behavior by using `ordered: false` in the options

If there is an error, the errored document is aborted, then the insertion continues with the other documents

### `writeConcern: {w: value, j: boolean, wtimeout: number}`

Write concern describes the level of acknowledgment requested from MongoDB for write operations to a standalone mongod, replica sets, or sharded clusters.

- the w option to request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.

- the j option to request acknowledgment that the write operation has been written to the on-disk journal, and

- the wtimeout option to specify a time limit to prevent write operations from blocking indefinitely

## Atomicity

MongoDB CRUD operations are atomic on the document level (including embedded documents), meaning that all the properties from a document are inserted, or the document insertion fails

For many documents, for example `insertMany()`, the atomicity is guaranteed per document

## `mongoimport`

[Check docs for more info](https://www.mongodb.com/docs/database-tools/mongoimport/)

```bash
mongoimport tv-shows.json -d movieData -c movies --jsonArray --drop
```

## Read operation

### `$eq` operator - security Implication

Always use the explicit form `{ field: { $eq: <value> } }` with user-supplied input to avoid problems with maliciously formed queries

### Querying arrays

- Exact equality

```javascript
find({ genres: ['Drama'] });
```

- Presence of an array item

```javascript
find({ genres: 'Drama' });
```

### Comparison operators

- `$eq`
- `$ne`
- `$gt`
- `$gte`
- `$lt`
- `$lte`

### `$in` and `$nin` operators, comparison operators

The $in operator compares each parameter to each document in the collection, which can lead to performance issues. To improve performance:

- It is recommended that you limit the number of parameters passed to the
  $in operator to tens of values
- Using hundreds of parameters or more can negatively impact query performance.
- Create an index on the field you want to query.

- `$in` queries possible values for an item

```javascript
find({ age: { $in: [55, 65, 35] } });
```

- `$nin` is the opposite of `$in`

### Logical operators

Logical operators return data based on expressions that evaluate to true or false

MongoDB provides an implicit `AND` operation when specifying a comma separated list of expressions

Sometimes you don't need `$and`, because of the implicit behavior or because of a query rewrite

When passed an array argument, the $not operator may yield unexpected results. To match documents based on multiple false conditions, use $nor

- `$or: []`
- `$not: []`
- `$and: []`
- `{field: $not: {}}`
  - You must use the $not operator with another operator expression
  - Sometimes you just need a `$ne` operator

### `$or` versus `$in`

When using $or with `expressions` that are equality checks `for the value of the same field, use the $in operator instead of the $or operator`

### Element query

- `$exists`
  - The $exists operator matches documents that contain or do not contain a specified field, `including documents where the field value is null`
- `$type`
  - You can filter fields by their value type, like `number`, `string`, `array`, `date`, etc.

### Evaluation query

Evaluation operators return data based on evaluations of either individual fields or the entire collection's documents

- `$mod: [divisor, remainder]`
- `$regex`
- `$jsonSchema`
- `$expr`
  - `find({$expr: {$gt: ["$fieldName1", "fieldName2"]}})`

### Array query

Array operators return data based on array conditions

- `{ <arrayField>: { $all: [ <value1> , <value2> ... ] } }`
  - array that contains all the specified elements
- `$elemMatch`
- `$size`

## Cursor

- `.sort()`
- `.skip()`
- `.limit()`

## Update operators

- `$set`
- `$inc`
  - You cannot update and set the same field at the same time
  - Amount to increment can be positive or negative
  - Use of the $inc operator on a field with a null value will `generate an error`
  - `{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }`
- `$min`
  - The $min updates the value of the field to a specified value `if the specified value is less` than the `current value` of the field
  - `{ $min: { <field1>: <value1>, ... } }`
  - If the field does not exist, the $min operator sets the field to the specified value
- `$max`
  - The $max operator updates the value of the field to a specified value `if the specified value is greater` than the `current value` of the field.
  - `{ $max: { <field1>: <value1>, ... } }`
  - If the field does not exist, the $max operator sets the field to the specified value
- `$mul`
  - Multiply the value of a field by a number
  - `{ $mul: { <field1>: <number1>, ... } }`
- `$unset`
  - deletes a particular field
  - `{ $unset: { <field1>: "", ... } }`
  - The specified value in the $unset expression (i.e. "") does not impact the operation
  - If the field does not exist, then $unset does nothing (i.e. no operation)
  - When used with $ to match `an array element, $unset replaces the matching element with null` rather than removing the matching element from the array
- `$rename`
  - updates the name of a field
  - `{ $rename: { <field1>: <newName1>, <field2>: <newName2>, ... } }`
  - The $rename operator can move fields into and out of embedded documents
  - $rename does not work on embedded documents in arrays
- `$currentDate`
  - sets the value of a field to the current date, either as a Date or a timestamp
  - The default type is Date
  - `{ $currentDate: { <field1>: <typeSpecification1>, ... } }`
    - `<typeSpecification>` can be either:
    - a boolean true to set the field value to the current date as a Date
    - a document { $type: "timestamp" } or { $type: "date" } which explicitly specifies the type
- `$setOnInsert`
  - If an update operation with `upsert: true` results in an insert of a document, then $setOnInsert `assigns the specified values to the fields in the document`
  - query, set, then setOnInsert are used to create the new document

```javascript
db.collection.updateOne(
   <query>,
   { $setOnInsert: { <field1>: <value1>, ... } },
   { upsert: true }
)
```

### Update options

- `upsert: true`
  - If the document exists, update it
  - Else, create a document with both data from filter and data

## Array update operators

### positional $ operator

It represents the array item to update

`The positional $ operator acts as a placeholder for the first match of the update query document`

`When matching on multiple arrays, instead use the filtered positional operator $[<identifier>]`

```javascript
db.collection.updateOne(
   { <array>: value ... },
   { <update operator>: { "<array>.$" : value } }
)
```

The positional $ operator cannot be used for queries which traverse more than one array, such as queries that traverse arrays nested within other arrays, because `the replacement for the positional $ operator is a single value`

When used with the `$unset operator`, the positional $ operator does not remove the matching element from the array but rather `sets it to null`

If the query matches the array using a negation operator, such as `$ne, $not, or $nin`, then `you cannot use the positional $ operator` to update values from this array

### positional $[] operator

It's kind of a loop over the items of the selected array

It updates all items in the array

```javascript
db.collection.updateOne(
   { <query conditions> },
   { <update operator>: { "<array>.$[]" : value } }
)
```

### positional operator $[identifier]

It identifies the array items that match the `arrayFilters` conditions for an update operation

```javascript
db.collection.updateMany(
   { <query conditions> },
   { <update operator>: { "<array>.$[<identifier>]" : value } },
   { arrayFilters: [ { <identifier>: <condition> } ] }
)
```

### Updating nested arrays

`The dot notation doesn't work`

Use a combination of $[] and $[identifier]

### `$push`

Add items to the array

```javascript
{ $push: { <arrayName>: <value1>, ... } }
```

You can also use with modifiers

- `$each`
  - It's an array os items to add to the array
- `$slice`
  - It modify the array size, which removes array items
  - Requires the use of $each modifier
- `$sort`
  - It sorts the array after the action of the previous modifiers
  - Requires the use of $each modifier
- `$position`
  - It defines the location where to start inserting the items added by the $each modifier
  - Without the $position modifier, the $push appends the items to the end of the array
  - Requires the use of $each modifier

```javascript
{ $push: { <arrayField>: { <modifier1>: <value1>, <modifier2>: <value2>... }, ... } }
```

```javascript
db.students.updateOne(
	{ _id: 5 },
	{
		$push: {
			quizzes: {
				$each: [
					{ wk: 5, score: 8 },
					{ wk: 6, score: 7 },
					{ wk: 7, score: 6 },
				],
				$position: 3,
				$sort: { score: -1 },
				$slice: 4,
			},
		},
	}
);
```

### `$pull`

Removes from an existing array all instances of a value or values that match a specified condition

```javascript
{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
```

```javascript
db.stores.insertMany( [
   {
      _id: 1,
      fruits: [ "apples", "pears", "oranges", "grapes", "bananas" ],
      vegetables: [ "carrots", "celery", "squash", "carrots" ]
   },
   {
      _id: 2,
      fruits: [ "plums", "kiwis", "oranges", "bananas", "apples" ],
      vegetables: [ "broccoli", "zucchini", "carrots", "onions" ]
   }
] )
.
.
.
db.stores.updateMany(
	{},
	{ $pull: { fruits: { $in: ['apples', 'oranges'] }, vegetables: 'carrots' } }
);
```

```javascript
db.profiles.insertOne( { _id: 1, votes: [ 3, 5, 6, 7, 7, 8 ] } )
.
.
.
db.profiles.updateOne({ _id: 1 }, { $pull: { votes: { $gte: 6 } } });
```

### `$pop`

Removes the first or last element of an array

Pass $pop a value of -1 to remove the first element of an array and 1 to remove the last element in an array

```javascript
db.students.updateOne({ _id: 1 }, { $pop: { scores: -1 } });
```
