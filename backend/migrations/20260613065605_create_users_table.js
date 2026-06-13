exports.up = function (knex) {
  return knex.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();
        table.string("email", 100).notNullable();
        table.bigInteger("phone").notNullable();
        table.text("password").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};