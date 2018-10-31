# bsql
A mysql client of sql styled api.

## Install
```bash
npm i bsql --save
```

## Usage

### connect

```js
import {connect} from 'bsql';

const db = connect({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '',
	database: 'test',
});

const rows = db.select(['id', 'name', 'age']).from('user').where({age: 20});

```
Bsql connectin is baseed on pooling connections,visit [https://github.com/mysqljs/mysql#pool-options]() to sea more options.

### select
```js
//select all
db.select().from('user'); // SELECT * FROM `user`;

// select columns
db.select(['id', 'name']).from('user'); // SELECT `id`, `name` FROM `user`;

// equal
db.select().from('user').where({name: 'lili'}); // SELECT * FROM `user` WHERE `name` = 'lili';

// $gt(>) $gte(>=) $lt(<) $lte(<=) $not(<>)
db.select().from('user').where({age: {$gt: 30}});// SELECT * FROM `user` WHERE age > 30;

// $like(LIKE) $notLike(NOT LIKE)
db.select().from('user').where({name: {$like: '%li'}}); // SELECT * FROM `user` WHERE `name` LIKE '%li';

// $in(IN) $notIn(NOT IN)
db.select().from('user').where({name: {$in: ['lili', 'kk']}}); // SELECT * FROM `user` WHERE `name` IN ('lili', 'kk');

// null
db.select().from('user').where({name: {$isNull: true}}); // SELECT * FROM `user` WHERE `name` IS NULL;

// not null
db.select().from('user').where({name: {$isNull: false}}); // SELECT * FROM `user` WHERE `name` IS NOT NULL;

// text
db.select().where('name=? and age=?', ['lili', 20]); // SELECT * FROM `user` WHERE `name`='lili' and age=20;

// and
db.select().from('user').where({age: 20, gender: 1}); // SELECT * FROM `user` WHERE `age` = 20 AND `gender` = 1;

// or
db.select().from('user').where({age: 20}, {gender: 1}); // SELECT * FROM `user` WHERE `age` = 20 OR `gender` = 1;

// order by
db.select().from('user').orderBy(['name', 1], ['age', -1]);// SELECT * FROM `user` WHERE `name`='lili' and age=20;

// limit offset
db.select().from('user').limit(20).offset(19);
```

### count
```
const count = await db.count('user').where({age: {$gt: 20}}); // SELECT COUNT(*) as count FROM `user` WHERE `age` > 20;
```

### insert
```
await db.insertInto('user').values([{name: 'lili', age: 21}, {name: 'lucy', age: 22}]); // INSERT INTO `user` (`name`, `age`) VALUES ('lili', 21), (lucy, 22);
```

### update
```
await db.update('user').set({age: 23, gender: 2}).where({name: 'lili'}); // UPDATE `user` SET `age` = 23, `gender` = 2 WHERE `name` = 'lili';
```

### delete
```
await db.deleteFrom('table').where({name: 'lucy'}); // DELETE FROM `user` WHERE `name` = 'lucy';
```