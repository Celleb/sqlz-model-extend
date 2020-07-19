/**
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2020 Jonas Tomanga
 * All rights reserved
 */

import { extendModel, DbDefined } from '../dist';
import { ModelDefined } from 'sequelize';
import { copyFileSync, unlinkSync } from 'fs';
const { exec } = require('child_process');

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

describe('tests', () => {
    beforeAll((done) => {
        copyFileSync(__dirname + '/db/initial.sqlite', __dirname + '/db/test.sqlite');
        exec('npx sequelize-cli db:migrate', (err: any, stdout: any, stderr: any) => {
            if (err) {
                console.log(`stderr: ${stderr}`);
                throw err;
            }

            console.log(`stdout: ${stdout}`);
            done();
        });
    });

    afterAll(() => {
        db.sequelize.close();
        console.log('delete');
        unlinkSync(__dirname + '/db/test.sqlite');
    });

    describe('extendModel', () => {
        const userModel = extendModel(
            db['User'] as ModelDefined<UserReadAttributes, UserWriteAttributes>
        );
        const initialRecords = [
            {
                firstName: 'Shikuvule',
                lastName: 'Indaba',
                email: 'hi@mvp.com',
            },
            {
                firstName: 'Ndemupewa',
                lastName: 'Shikuvlue',
                email: 'hi@mvp.com',
            },
            {
                firstName: 'Shekupe',
                lastName: 'Nelengwa',
                email: 'hi@mvp.com',
            },
        ];

        beforeEach(async () => {
            await userModel.bulkCreate(initialRecords);

            const records = await userModel.findAll({ where: {} });

            expect(records.length).toEqual(initialRecords.length);
        });

        afterEach(async () => {
            await userModel.destroy({ where: {}, truncate: true });
            expect(await userModel.findAll({ where: {} })).toEqual([]);
        });

        describe('.bulkInsert', () => {
            it('creates in bulk and returns `toJSON` value', async () => {
                const users = await userModel.bulkInsert([
                    { firstName: 'Your Name', lastName: 'Your Last Name', email: 'Your Email' },
                ]);
                expect(users.length).toEqual(1);
                expect(users[0].fullName).toEqual('Your Name Your Last Name');
            });
        });

        describe('.getAll', () => {
            it('returns all records with their `.toJSON` value', async () => {
                const users = await userModel.getAll();
                expect(users.length).toEqual(initialRecords.length);
            });

            it('returns all records with their `raw` value', async () => {
                const users = await userModel.getAll({ raw: true });
                expect(users.length).toEqual(initialRecords.length);
            });
        });
        describe('.getByPk', () => {
            it("finds a record by it's primary key and returns it's `toJSON` value", async () => {
                const users = await userModel.getAll({ raw: true });
                const user = await userModel.getByPk(users[0].id);
                expect(user).toBeDefined();
                expect(user?.lastName).toBeDefined();
            });

            it("finds a record by its primary key and returns it's `raw` value", async () => {
                const users = await userModel.getAll({ raw: true });
                const user = await userModel.getByPk(users[0].id, { raw: true });
                expect(user?.lastName).toBeDefined();
            });

            it('finds a record by its primary key and returns `null` when not found', async () => {
                const user = await userModel.getByPk(1000);
                expect(user).toEqual(null);
            });
        });

        describe('.getOne', () => {
            it("finds a matching record and returns it's `.toJSON` value", async () => {
                const user = await userModel.getOne({ where: { firstName: 'Shikuvule' } });
                expect(user).toBeDefined();
                expect(user?.lastName).toBeDefined();
            });

            it("finds a matching record and returns it's `raw` value", async () => {
                const user = await userModel.getOne({
                    where: { firstName: 'Shikuvule' },
                    raw: true,
                });
                expect(user).toBeDefined();
                expect(user?.lastName).toBeDefined();
            });

            it("finds a matching record and returns it's `null` when not found", async () => {
                const user = await userModel.getOne({
                    where: { firstName: 'Something Not In the DB' },
                    raw: true,
                });
                expect(user).toEqual(null);
            });
        });

        describe('.getOrCreate', () => {
            it("finds a matching record or creates it and returns it's `.toJSON` value", async () => {
                const existingUser = await userModel.getOne({
                    where: { firstName: 'Shikuvule' },
                });
                const user = await userModel.getOrCreate({
                    where: {
                        firstName: 'Shikuvule',
                        lastName: 'Indaba',
                        email: 'hi@mvp.com',
                    },
                });
                expect(user).toBeDefined();
                expect(user).toEqual(existingUser);
            });

            it("finds a matching record or creates it and returns it's `raw` value", async () => {
                const user = await userModel.getOrCreate({
                    where: {
                        firstName: 'Sheepo',
                        lastName: 'Indaba',
                        email: 'hi@mvp.com',
                    },
                    raw: true,
                });

                const users = await userModel.getAll();
                expect(user).toBeDefined();
                expect(users.length).toEqual(initialRecords.length + 1);
            });
        });
        describe('.insert', () => {
            it("creates a new record and returns it's `.toJSON` value", async () => {
                const user = await userModel.insert({
                    firstName: 'Shikuvule',
                    lastName: 'Indaba',
                    email: 'hi@mvp.com',
                });
                const users = await userModel.getAll();
                expect(user).toBeDefined();
                expect(users.length).toEqual(initialRecords.length + 1);
            });

            it("creates a new record and returns it's `raw` value", async () => {
                const user = await userModel.insert(
                    {
                        firstName: 'Shikuvule',
                        lastName: 'Indaba',
                        email: 'hi@mvp.com',
                    },
                    {
                        raw: true,
                    }
                );

                const users = await userModel.getAll();
                expect(user).toBeDefined();
                expect(users.length).toEqual(initialRecords.length + 1);
            });
        });
        describe('.patch', () => {
            it("updates an existing record and returns it's `.toJSON` value", async () => {
                await userModel.patch(
                    {
                        lastName: 'Oshikuku',
                    },
                    { where: { firstName: 'Shikuvule' } }
                );
                const updatedUser = await userModel.getOne({
                    where: { firstName: 'Shikuvule' },
                });

                expect(updatedUser?.lastName).toEqual('Oshikuku');
            });
        });
        describe('.upPatch', () => {
            it("updates an existing record or creates it and returns it's `.toJSON` value", async () => {
                await userModel.upPatch({
                    firstName: 'Sheepo',
                    lastName: 'Indaba',
                    email: 'hi@mvp.com',
                });
                const updatedUser = await userModel.getOne({
                    where: { firstName: 'Sheepo' },
                });

                expect(updatedUser?.firstName).toEqual('Sheepo');
            });
        });
    });
});
