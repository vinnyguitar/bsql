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
const rows = await db
	.select(['id', 'name', 'age', 'gender']) // SELECT `id`, `name`, `age`, `gender`
	.from('user') // FROM `user`
	.where({gender: 1}) // WHERE `age` = 20 and `gender` = 1
	.orderBy([['age', -1]]) // ORDER BY `age` DESC
	.limit(20) // LIMIT 20
	.offset(9);// OFFSET 9
console.log(rows);
[{id: 1, name: 'ccate', age: 20, gender: 1}]
```

### count
```
const count = await db.count('table').where({col: 1});
```

### insert
```
await db.insertInto('table').values([{col1: 1, col2: 2}, {col1: 3, col2: 4}]);
```

### update
```
await db.update('table').set({col1: 10, col2: 20}).where({col1: 1});
```

### delete
```
await db.deleteFrom('table').where({});
```
### where