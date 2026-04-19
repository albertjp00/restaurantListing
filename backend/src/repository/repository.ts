

import pool from "../db";
import { IRepository, IUser } from "../interfaces.ts/interfaces";


export class Repository implements IRepository {

  async findUser(email: string): Promise<IUser | null> {
    try {
      const result = await pool.query(
        "SELECT id, email, password FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }


  async create(
    name: string,
    email: string,
    phone: number,
    password: string
  ) {
    try {
      const query = `
        INSERT INTO users (name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const values = [name, email, phone, password];

      const result = await pool.query(query, values);

      return result.rows[0]; 
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }


  findByName = async (name: string) => {
  try {
    const query = `
      SELECT * FROM restaurants
      WHERE name = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [name]);

    return result.rows[0] || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


changePassword = async (userId: string, hashedPassword: string) => {
  try {
    const query = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [hashedPassword, userId]);

    if (result.rowCount === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


  createRestaurant = async (data: any) => {
  const query = `
    INSERT INTO restaurants (user_id, name, address, phone, email)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    data.userId,
    data.name,
    data.address,
    data.phone,
    data.email,
  ];

  await pool.query(query, values);
};

getRestaurants = async (
  userId: string,
  page: number,
  limit: number,
  search: string
) => {
  try {
    const offset = (page - 1) * limit;

    // 🔍 Search + Pagination Query
    const query = `
      SELECT id, name, address, phone, email
      FROM restaurants
      WHERE user_id = $1
      AND name ILIKE $2
      ORDER BY id DESC
      LIMIT $3 OFFSET $4
    `;

    const values = [userId, `%${search}%`, limit, offset];

    const result = await pool.query(query, values);

    // 🔢 Total count for pagination
    const countQuery = `
      SELECT COUNT(*) FROM restaurants
      WHERE user_id = $1
      AND name ILIKE $2
    `;

    const countResult = await pool.query(countQuery, [userId, `%${search}%`]);

    return {
      restaurants: result.rows,
      total: Number(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


updateRestaurant = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE restaurants 
     SET 
       name = COALESCE($1, name),
       address = COALESCE($2, address),
       phone = COALESCE($3, phone),
       email = COALESCE($4, email)
     WHERE id = $5 
     RETURNING *`,
    [
      data.name ?? null,
      data.address ?? null,
      data.phone ?? null,
      data.email ?? null,
      id
    ]
  );

  return result.rows[0] || null;
};

deleteRestaurant = async (id: string) => {
  await pool.query("DELETE FROM restaurants WHERE id = $1", [id]);
};
  
}