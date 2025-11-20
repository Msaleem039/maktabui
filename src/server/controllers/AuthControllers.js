const User = require("../models/User");
const { generateToken } = require("../services/JwtToken");

const register = async (req) => {
    try {
        const body = await req.json();
        const { email, password, role } = body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
        }

        const user = await User.create({ email, password, role });

        return new Response(
            JSON.stringify({
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

const login = async (req) => {
    try {
        const body = await req.json();
        const { email, password, role } = body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
        }

        if (user.role !== role) {
            return new Response(JSON.stringify({ message: `User is not a ${role}` }), { status: 403 });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
        }

        return new Response(
            JSON.stringify({
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

module.exports = { register, login }