"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISHES_SCHEMA = void 0;
exports.DISHES_SCHEMA = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            additionalProperties: false,
            required: ['name', 'description'],
            properties: {
                _id: {},
                name: {
                    bsonType: 'string',
                    description: 'Must be string'
                },
                description: {
                    bsonType: 'string',
                    description: 'Must be string'
                }
            }
        }
    }
};
// interface Dishes {
//     name: string;
//     description: string;
// }
// export const DISHES_SCHEMA = {
//     validator: {
//         $and: [
//             {name: {$type: "string"}},
//             {description: {$type: "string"}}
//         ]
//     }
// };
