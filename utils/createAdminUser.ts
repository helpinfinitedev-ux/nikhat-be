import User from "../models/User";
import bcrypt from "bcrypt";

export const createAdminUser = async () => {
  const adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Admin", emailAddress: "admin@example.com", phoneNumber: "1234567890", password: passwordHash, role: "admin" });
  }
  console.log("Admin user created");
};
