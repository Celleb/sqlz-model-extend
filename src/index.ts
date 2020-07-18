/**
 * Extends sequelize models
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2020 Jonas Tomanga
 * All rights reserved
 */

import { extend } from './utils';
import {
    ModelCtor,
    Model,
    CreateOptions,
    ModelDefined,
    Identifier,
    FindOptions,
    FindOrCreateOptions,
    UpdateOptions,
    BulkCreateOptions,
    UpsertOptions,
} from 'sequelize';

export type ModelType<R, W> = ModelCtor<Model<R, W>> | ModelDefined<R, W>;
export type DataRecord<R, W> = Model<R, W> | R | null;
/**
 * Extends sequelize model with methods that returns POJO with correct types
 * This ensures you get the correct data types in typescript.
 * @param model Sequelize
 */
export function extendModel<R, W>(model: ModelType<R, W>) {
    return extend(model, {
        async bulkInsert(
            this: typeof model,
            records: W[],
            options: BulkCreateOptions<R>
        ): Promise<R[]> {
            const results = await this.bulkCreate(records, { ...options });
            return results.map((result) => result.toJSON()) as any;
        },
        async getAll(this: typeof model, options: FindOptions<R> = {}): Promise<R[]> {
            return recordsToJson(await this.findAll(options), !!options.raw);
        },
        async getByPk(
            this: typeof model,
            value: Identifier,
            options?: Omit<FindOptions<R>, 'where' | 'rejectOnEmpty'>
        ): Promise<R | null> {
            const record = (await this.findByPk(value, {
                ...(options || {}),
                rejectOnEmpty: false,
            })) as any;
            return recordToJson(record, !!options?.raw);
        },
        async getOne(
            this: typeof model,
            options: Omit<FindOptions<R>, 'rejectOnEmpty'>
        ): Promise<R | null> {
            return recordToJson(
                await this.findOne({
                    ...(options || {}),
                    rejectOnEmpty: false,
                }),
                !!options?.raw
            );
        },
        async getOrCreate(this: typeof model, options: FindOrCreateOptions<R, W>): Promise<R> {
            const [record] = await this.findOrCreate(options);
            return recordToJson(record, !!options.raw);
        },
        async insert(this: typeof model, values: W, options?: CreateOptions<R>): Promise<R> {
            return recordToJson(await this.create(values, { ...(options || {}) }), !!options?.raw);
        },
        /**
         * Returns updates matching records and return a collections of updated records
         */
        async patch(
            this: typeof model,
            values: Partial<R>,
            options: UpdateOptions<R>
        ): Promise<R[]> {
            const [, records] = await this.update(values, { ...options, returning: true });
            return recordsToJson(records, false);
        },
        async upPatch(this: typeof model, values: W, options: UpsertOptions<R>): Promise<R> {
            const [record] = await this.upsert(values, { ...options, returning: true });
            return recordToJson(record, false);
        },
    });
}

function recordsToJson<R, W, M extends Model<R, W>>(data: M[], isRaw: boolean): R[];
function recordsToJson<R>(data: R[], isRaw: true): R[];
function recordsToJson<R>(data: R[], isRaw: boolean): R[] {
    return isRaw ? data : data.map((item: any) => item.toJSON());
}

function recordToJson<D>(data: D, isRaw: true): D;
function recordToJson<R, W>(data: DataRecord<R, W>, isRaw?: boolean): R;
function recordToJson(data: any, isRaw?: boolean): any {
    return isRaw || !data ? data : data.toJSON();
}
