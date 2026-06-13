

import { db } from "../db/knex";
import { IRepository, IRestaurant, IUser } from "../interfaces.ts/interfaces";


export class Repository implements IRepository {

  async findUser(email: string): Promise<IUser | null> {
    try {
      const user = await db("users")
        .select("id", "email", "password")
        .where({ email })
        .first();

      return user || null;
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
    const [user] = await db("users")
      .insert({ name, email, phone, password })
      .returning("*");

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}


findByName = async (name: string) => {
  try {
    const restaurant = await db("restaurants")
      .where({ name })
      .first();

    return restaurant || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


changePassword = async (userId: string, hashedPassword: string) => {
  try {
    const result = await db("users")
      .where({ id: userId })
      .update({ password: hashedPassword })
      .returning("id");

    if (result.length === 0) {
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


createRestaurant = async (data: IRestaurant) => {
  await db("restaurants").insert({
    user_id: data.userId,
    name: data.name,
    address: data.address,
    phone: data.phone,
    email: data.email,
  });
};



getRestaurants = async (
  userId: string,
  page: number,
  limit: number,
  search: string
) => {
  try {
    const offset = (page - 1) * limit;

    const query = db("restaurants")
      .where("user_id", userId)
      .andWhere("name", "ilike", `%${search}%`);

    const restaurants = await query
      .clone()
      .select("id", "name", "address", "phone", "email")
      .orderBy("id", "desc")
      .limit(limit)
      .offset(offset);

    const [{ count }] = await query.clone().count("* as count");

    return {
      restaurants,
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


updateRestaurant = async (id: string, data: Partial<IRestaurant>) => {
  const [updated] = await db("restaurants")
    .where({ id })
    .update({
      ...(data.name && { name: data.name }),
      ...(data.address && { address: data.address }),
      ...(data.phone && { phone: data.phone }),
      ...(data.email && { email: data.email }),
    })
    .returning("*");

  return updated || null;
};

deleteRestaurant = async (id: string) => {
  await db("restaurants").where({ id }).del();
};
}