# bsql
Mysql client of sql styled api.

## Installation
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
	password: 'test',
	database: 'test',
});

const rows = db.select(['id', 'name']).from('user').where({age: 20});

```

### Options

### Select
```js
select(['col1', 'col2'])
.from('table')
.where({})
.groupBy()
.limit()
.offset();
```

### Count

### Insert

### Update

### Delete