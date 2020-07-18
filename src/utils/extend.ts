/**
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2020 Jonas Tomanga
 * All rights reserved
 */

export function extend<O, S>(object: O, source: S): O & S {
    return Object.create(
        Object.create(Object.getPrototypeOf(object), Object.getOwnPropertyDescriptors(object)),
        Object.getOwnPropertyDescriptors(source)
    );
}
