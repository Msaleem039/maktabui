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

export const getAdminById = async (req) => {
  try {
    const { id } = await req.json();

    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Admin not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Admin fetched successfully", 
        admin 
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const updateAdmin = async (req) => {
  try {
    const { id, name, address, phone, photo } = await req.json();

    const admin = await Admin.findById(id);

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Admin not found" }),
        { status: 404 }
      );
    }

    admin.name = name || admin.name;
    admin.address = address || admin.address;
    admin.phone = phone || admin.phone;
    admin.photo = photo || admin.photo;

    const updatedAdmin = await admin.save();

    return new Response(
      JSON.stringify({
        message: "Admin updated successfully",
        admin: {
          id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          phone: updatedAdmin.phone,
          address: updatedAdmin.address,
          photo: updatedAdmin.photo
        },
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

