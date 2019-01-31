# bsql
bsql是一个mysql客户端，为开发者提供了一套类sql语义的接口。最大程度利用sql语法，不做过度封装，轻量透明又不失灵活性，支持typescript。

## 安装
```bash
yarn add bsql
# or
npm i bsql --save
```

## 用法

### 初始化

```js
import bsql from 'bsql';

const db = bsql({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '123456',
	database: 'test',
});

const rows = await db.select('id', 'name', 'age').from('user').where({age: 20});

```
bsql底层基于mysql连接池,访问[https://github.com/mysqljs/mysql#pool-options]() 查看更多配置。
**注意：字段名会自动在驼峰(js)和蛇形命名(数据库表)之间转换。**

### 查询
```js
// 查询全部字段
db.select('*').from('user'); // SELECT * FROM `user`;
db.select().from('user'); // 缺省参数，和前者等价

// 查询特定字段
db.select('id', 'name').from('user'); // SELECT `id`, `name` FROM `user`;

// 泛型参数(TS)
const user: User[] = await db.select<User>(*).from('user');

// and条件
db.select().from('user').where({name: 'lili', age: 20}); // SELECT * FROM `user` WHERE `name` = 'lili' AND `age` = 20;

// or条件
db.select().from('user').where({$or: [{name: 'lili'}, {age: 20}]}); // SELECT * FROM `user` WHERE `name` = 'lili' OR `age` = 20;

// 比较 $gt(>) $gte(>=) $lt(<) $lte(<=) $not(<>)
db.select().from('user').where({age: {$gt: 30}});// SELECT * FROM `user` WHERE age > 30;

// 模糊匹配 $like(LIKE) $notLike(NOT LIKE)
db.select().from('user').where({name: {$like: '%li'}}); // SELECT * FROM `user` WHERE `name` LIKE '%li';

// 包含 $in(IN) $notIn(NOT IN)
db.select().from('user').where({name: {$in: ['lili', 'kk']}}); // SELECT * FROM `user` WHERE `name` IN ('lili', 'kk');

// 空值
db.select().from('user').where({name: {$isNull: true}}); // SELECT * FROM `user` WHERE `name` IS NULL;

// 非空
db.select().from('user').where({name: {$isNull: false}}); // SELECT * FROM `user` WHERE `name` IS NOT NULL;

// 分组查询
db.select().from('user').groupBy('zipCode'); // SELECT * FROM `user` GROUP BY `zip_code`

// 分组条件
db.select().from('user').groupBy('zipCode').having({age: 12}); // SELECT * FROM `user` GROUP BY `zip_code` HAVING `age`=12;

// 排序,1: ASC, -1: DESC
db.select().from('user').orderBy(['name', 1], ['age', -1]); // SELECT * FROM `user` ORDER BY `name` ASC, `age` DESC;

// limit offset
db.select().from('user').limit(20).offset(19); // SELECT * FROM `user` LIMIT 20 OFFSET 10;
```

### 计数
```js
db.count().from('user').where({age: {$gt: 20}}); // SELECT COUNT(*) as count FROM `user` WHERE `age` > 20;
```

### 新增
```js
db.insert([{name: 'lili', age: 21}, {name: 'lucy', age: 22}]).into('user'); // INSERT INTO `user` (`name`, `age`) VALUES ('lili', 21), (lucy, 22);

// 针对重复值做操作，一般用于批量更新
db.insert([{id: 1, name: 'lili'}, {id: 2, name: 'leo'}]).into('user').onDuplicateKey('UPDATE name=VALUES(name)'); // INSERT INTO `user` (`name`, `age`) VALUES ('lili', 21), (lucy, 22) ON DUPLICATE KEY UPDATE name=VALUES(name);

```

### 更新
```js
db.update('user').set({age: 23, gender: 2}).where({name: 'lili'}); // UPDATE `user` SET `age` = 23, `gender` = 2 WHERE `name` = 'lili';
```

### 删除
```js
db.delete({name: 'lucy'}).from('table'); // DELETE FROM `user` WHERE `name` = 'lucy';
```

### 批量更新
```js
// 批量更新第二个参数是参照字段，原理见：https://dev.mysql.com/doc/refman/5.7/en/case.html
db.batch('user').update([{id: 1, name: 'hh'},{id: 2, name: 'bb'}], 'id');
```

### 执行原始sql
```js
db.query('delete from user where name=?', ['six']); // delete from user where name='leo';
```
### 事务
```js
const trans = await db.beginTransaction();
try {
	trans.insert(...);
	trans.update(...);
	trans.commit();
} catch(e) {
	trans.rollback();
}
```