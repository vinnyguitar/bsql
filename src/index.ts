import * as mysql from "mysql";
import { Client } from "./client";
import { Column, Entity } from "./entity";
import { config } from './config';

export {
    Column,
    Entity,
    Client as BsqlClient,
    config,
};

export const escape = mysql.escape;
export const escapeId = mysql.escapeId;

export function connect(config) {
    const db = mysql.createPool(config);
    return new Client(db);
}
