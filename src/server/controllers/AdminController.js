import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const createAdmin = async (req) => {
  try {
    const { name, email, password, address, phone, photo } = await req.json();

    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin with this email already exists" }),
        { status: 400 }
      );
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      address,
      phone,
      photo,
    });

    const newUser = await User.create({
      email,
      password,
      role: "Admin", 
    });

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newUser.role,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const getAllAdmin = async (req) => {
  try {    
    const admins = await Admin.find()
      .select("-password") 
      .sort({ createdAt: -1 })
      .lean();

    return new Response(
      JSON.stringify({
        message: "Admins fetched successfully",
        admins: admins,
        count: admins.length
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching admins:", error);
    
    return new Response(
      JSON.stringify({ 
        message: "Failed to fetch admins",
        error: error.message 
      }),
      { status: 500 }
    );
  }
}
