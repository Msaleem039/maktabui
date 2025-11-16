import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Class from "../models/Class.js";

export const createTeacher = async (req) => {
  try {
    const body = await req.json();
    const {
      fullName,
      gender,
      dateOfBirth,
      address,
      phone,
      email,
      password,
      qualification,
      specialization,
      experienceYears,
      hireDate,
      assignedClasses,
      subjects,
      languages,
    } = body;

    if (!fullName || !email || !password || !phone) {
      return new Response(
        JSON.stringify({
          message: "Full name, email, password, and phone are required.",
        }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User with this email already exists." }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "Teacher",
    });

    const teacher = new Teacher({
      user: user._id,
      fullName,
      gender,
      dateOfBirth,
      address,
      phone,
      email,
      password: hashedPassword,
      qualification,
      specialization,
      experienceYears,
      hireDate,
      assignedClasses: assignedClasses || [],
      subjects: subjects || [],
      languages: languages || [],
    });

    await teacher.save();

    return new Response(
      JSON.stringify({
        message: "Teacher created successfully.",
        teacher,
        user,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating teacher:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const getAllTeachers = async (req) => {
  try {
    const body = await req.json();
    const {
      page = 1,
      limit = 50,
      status,
      search,
      sortBy = "fullName", // Changed from "createdAt"
      sortOrder = "asc"     // Changed from "desc"
    } = body;

    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const teachers = await Teacher.find(filter)
      .populate('user', 'email role status')
      .populate('assignedClasses', 'className section gradeLevel')
      .select('-password') 
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalTeachers = await Teacher.countDocuments(filter);
    const totalPages = Math.ceil(totalTeachers / limit);

    return new Response(
      JSON.stringify({
        message: "Teachers fetched successfully.",
        teachers,
        pagination: {
          currentPage: page,
          totalPages,
          totalTeachers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const getTeacherById = async (req) => {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Teacher ID is required." }),
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(id)
      .populate('user', 'email role status')
      .populate('assignedClasses', 'className section gradeLevel')
      .populate('subjects')
      .select('-password');

    if (!teacher) {
      return new Response(
        JSON.stringify({ message: "Teacher not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Teacher fetched successfully.",
        teacher,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching teacher:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const updateTeacher = async (req) => {
  try {
    const body = await req.json();
    const {
      id,
      fullName,
      gender,
      dateOfBirth,
      address,
      phone,
      qualification,
      specialization,
      experienceYears,
      hireDate,
      assignedClasses,
      subjects,
      languages,
      status
    } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Teacher ID is required." }),
        { status: 400 }
      );
    }

    const updateData = {
      ...(fullName && { fullName }),
      ...(gender && { gender }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(address && { address }),
      ...(phone && { phone }),
      ...(qualification && { qualification }),
      ...(specialization && { specialization }),
      ...(experienceYears && { experienceYears }),
      ...(hireDate && { hireDate }),
      ...(assignedClasses && { assignedClasses }),
      ...(subjects && { subjects }),
      ...(languages && { languages }),
      ...(status && { status }),
    };

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return new Response(
        JSON.stringify({ message: "Teacher not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Teacher updated successfully.",
        teacher,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating teacher:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const deleteTeacher = async (req) => {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Teacher ID is required." }),
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return new Response(
        JSON.stringify({ message: "Teacher not found." }),
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(teacher.user);

    await Teacher.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({
        message: "Teacher deleted successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting teacher:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const getTeachersName = async (req) => {
  try {
    const teachers = await Teacher.find({}, { _id: 1, specialization: 1, fullName: 1 }).lean();

    return new Response(
      JSON.stringify({
        message: "Teacher names and specializations fetched successfully.",
        teachers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching teacher names:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};
