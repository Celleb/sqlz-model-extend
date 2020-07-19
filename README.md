# @celleb/sqlz-model-extend

Extends sequelize model instance with additional methods that returns the `raw` or `toJSON` object(s).
The return types of these methods are set to the read-attributes of the specified model.

An additional type is also provided to describe the `db` or `model/index` import called `DbDefined`.

## Getting started

```bash
npm install --save @celleb/sqlz-model-extend
```

Install sequelize and or sequelize-cli if you haven't already.

```bash
npm i --save sequelize
npm i --save-dev @types/node @types/validator
npm i --save-dev sequelize-cli
```

## Definition

```typescript
/**
 *@param model - Sequelize model
 */
function extendModel<R, W>(model: ModelCtor<Model<R, W>> | ModelDefined<R, W>);
```

## Usage

```typescript
import { extendModel } from '@celleb/sqlz-model-extend';
import { UserModel } from './user-model';

const modelX = extendModel(UserModel);
```

Example:

```typescript
import { extendModel, DbDefined } from '@celleb/sqlz-model-extend';
import { ModelDefined } from 'sequelize';

// using models created using sequelize-cli db:
const db: DbDefined = require('./models');

type UserWriteAttributes = {
 firstName?: string;
 lastName?: string;
 email?: string;
};

type UserReadAttributes = Required<UserWriteAttributes> & {
 id: number;
 fullName?: string;
 createdAt: string;
 updateAt: string;
};

const userModel = extendModel(db['User'] as ModelDefined<UserReadAttributes, UserWriteAttributes>);

await userModel.getAll(); // returns UserReadAttributes[]
```

Another Example:

```typescript
import { Sequelize, Model, DataTypes, Optional, ModelDefined } from 'sequelize';

import { extendModel } from '@celleb/sqlz-model-extend';

const sequelize = new Sequelize('mysql://root:asd123@localhost:3306/mydb');

interface UserAttributes {
 id: string;
 firstName: string;
 lastName: string;
 email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
 public id!: number;
 public firstName!: string;
 public lastName!: string;
 public email!: string;

 public readonly createdAt!: Date;
 public readonly updatedAt!: Date;
}

User.init(
 {
  id: {
   type: DataTypes.INTEGER.UNSIGNED,
   autoIncrement: true,
   primaryKey: true,
  },
  firstName: {
   type: new DataTypes.STRING(128),
   allowNull: false,
  },
  lastName: {
   type: new DataTypes.STRING(128),
   allowNull: false,
  },
  email: {
   type: new DataTypes.STRING(128),
   allowNull: false,
  },
 },
 {
  tableName: 'Users',
  sequelize,
 }
);

const userModel = extendModel(User as ModelDefined<UserAttributes, UserCreationAttributes>);

await userModel.getAll(); // returns UserAttributes[]
```

## Available methods

These methods are in addition to the usual sequelize model methods.
These methods take same parameters as those they are using.
All methods calls `.toJSON` on the returned objects unless `raw` is to true.

| Method       | Uses          | Info                                                                                                                                                                   |
| ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .bulkInsert  | .bulkCreate   | Forces `returning: true`                                                                                                                                               |
| .getAll      | .findAll      | Set option `{raw: true}` to get the raw objects otherwise `.toJSON` values will be returned.                                                                           |
| .getByPk     | .findByPk     | Set option `{raw: true}` to get the raw objects otherwise `.toJSON` values will be returned. Forces `rejectOnEmpty: false` and returns `null` when no record is found. |
| .getOne      | .findOne      | Set option `{raw: true}` to get the raw objects otherwise `.toJSON` values will be returned. Forces `rejectOnEmpty: false` and returns `null` when no record is found. |
| .getOrCreate | .findOrCreate | Set option `{raw: true}` to get the raw objects otherwise `.toJSON` values will be returned.                                                                           |
| .insert      | .create       | Forces `returning: true`                                                                                                                                               |
| .patch       | .update       | Forces `returning: true`                                                                                                                                               |
| .upPatch     | .upsert       | Forces `returning: true`                                                                                                                                               |

## DbDefined Interface

```typescript
interface DbDefined extends Record<string, any> {
 Sequelize: Sequelize;
 sequelize: Sequelize;
}
```
