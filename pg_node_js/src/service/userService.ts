import { query } from "../config/db/db";
import { CreateUser, User } from "../models/Model";

class UserService {
  async createUser(userData: CreateUser): Promise<User> {
    const { name, email, age } = userData;

    const text = `INSERT INTO userMyapp(name, email, age) 
     VALUES($1,$2,$3)
     RETURNING *`;

    const values = [email, name, age];

    try {
      const result = await query(text, values);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default UserService;
