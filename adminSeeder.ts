import { envConfig } from "./src/config/envConfig";
import User from "./src/database/model/userModel";
import bcrypt from "bcryptjs";

const adminSeeder = async () => {
try {
      const [data] = await User.findAll({
        where: {
          email: envConfig.admin_email,
        },
      });
      if (!data) {
        await User.create({
          name: envConfig.admin_user,
          email: envConfig.admin_email,
          password: bcrypt.hashSync(envConfig.admin_password as string, 8),
          role: "admin",
        });
        console.log("Admin is seeded");
      } else {
        console.log("Admin is already seeded");
      }
} catch (error) {
    console.log("Error occured at adminSeeder",error);
}
};

export default adminSeeder;
