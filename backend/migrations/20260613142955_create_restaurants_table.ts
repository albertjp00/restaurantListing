import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("restaurants");

  if (!exists) {
    await knex.schema.createTable("restaurants", (table) => {
      table.increments("id").primary();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table.string("name").notNullable();
      table.string("address").notNullable();
      table.bigInteger("phone").notNullable();
      table.string("email").notNullable();

      table.timestamps(true, true); // created_at, updated_at
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("restaurants");
}