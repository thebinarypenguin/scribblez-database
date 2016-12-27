'use strict';

exports.up = function(knex, Bluebird) {

  return new Bluebird(function (resolve) {
    resolve();
  })
  .then(() => {
    
    const set_updated_at = "CREATE OR REPLACE FUNCTION set_updated_at() "
                         + "RETURNS TRIGGER AS $$ "
                         + "BEGIN "
                         + "    NEW.updated_at = now(); " 
                         + "    RETURN NEW; " 
                         + "END; " 
                         + "$$ language 'plpgsql';"
    
    return knex.raw(set_updated_at);
  })
  .then(() => {

    return knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id');
      table.string('real_name', 80).notNullable();
      table.string('email_address', 80).unique().notNullable();
      table.string('username', 20).unique().notNullable();
      table.string('password_hash', 60).notNullable();
    });
  })
  .then(() => {

    return knex.schema.createTableIfNotExists('notes', function (table) {
      table.increments('id');
      table.integer('owner_id').notNullable().references('users.id').onDelete('CASCADE');
      table.text('body').notNullable();
      table.string('visibility', 10).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  })
  .then(() => {

    const notes_updated_at = "CREATE TRIGGER notes_updated_at "
                           + "BEFORE UPDATE ON notes "
                           + "FOR EACH ROW EXECUTE PROCEDURE set_updated_at();";

    return knex.raw(notes_updated_at);
  })
  .then(() => {

    return knex.schema.createTableIfNotExists('groups', function (table) {
      table.increments('id');
      table.integer('owner_id').notNullable().references('users.id').onDelete('CASCADE');
      table.string('name', 80).notNullable();
      table.unique(['owner_id', 'name']);
    });
  })
  .then(() => {

    return knex.schema.createTableIfNotExists('group_members', function (table) {
      table.increments('id');
      table.integer('group_id').notNullable().references('groups.id').onDelete('CASCADE');
      table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE');
      table.unique(['group_id', 'user_id']);
    });
  })
  .then(() => {

    return knex.schema.createTableIfNotExists('note_grants', function (table) {
      table.increments('id');
      table.integer('note_id').notNullable().references('notes.id').onDelete('CASCADE');
      table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE');
      table.integer('group_id').references('groups.id').onDelete('CASCADE');
    });
  });
};

exports.down = function(knex, Bluebird) {

  return new Bluebird(function (resolve) {
    resolve();
  })
  .then(() => {
    return knex.schema.dropTableIfExists('note_grants');
  })
  .then(() => {
    return knex.schema.dropTableIfExists('group_members');
  })
  .then(() => {
    return knex.schema.dropTableIfExists('groups');
  })
  .then(() => {
    return knex.raw('DROP TRIGGER IF EXISTS notes_updated_at ON notes');
  })
  .then(() => {
    return knex.schema.dropTableIfExists('notes');
  })
  .then(() => {
    return knex.schema.dropTableIfExists('users');
  })
  .then(() => {
    return knex.raw('DROP FUNCTION IF EXISTS set_updated_at()');
  });
};
