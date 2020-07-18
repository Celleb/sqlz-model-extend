/**
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2020 Jonas Tomanga
 * All rights reserved
 */

import { extend } from './extend';

describe('extend', () => {
    it('must be defined', () => {
        expect(extend).toBeDefined;
    });

    it('returns a clone of and extended object', () => {
        class Person {
            name = 'Shikuvlue';
            surname;
            setName;
            constructor(name: string) {
                this.surname = name;
            }

            getFullName() {
                return this.name + ' ' + this.surname;
            }
        }

        Person.prototype.setName = function (name) {
            this.name = name;
        };

        const person = new Person('Tomanga');

        const personPro = extend(person, {});

        expect(person === personPro).toEqual(false);
        expect(person.getFullName() === personPro.getFullName()).toEqual(true);
        personPro.setName('Jonas');
        expect(person.getFullName() === personPro.getFullName()).toEqual(false);

        const superHero = extend(personPro, {
            setLastName(name: string) {
                this.surname = name;
            },
        });

        expect(superHero.name).toEqual(personPro.name);
        superHero.setLastName('Kapindo');
        expect(superHero.getFullName()).toEqual('Jonas Kapindo');
        expect(personPro.getFullName()).toEqual('Jonas Tomanga');
    });
});
