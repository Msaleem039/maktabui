import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
    `user/loginUser`,
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, { 
                email, 
                password 
            });

            const data = res.data;
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot-password`, { 
                email 
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'user/verifyOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-otp`, { 
                email, 
                otp 
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset-password`, { 
                email, 
                otp, 
                newPassword 
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const resendOTP = createAsyncThunk(
    'user/resendOTP',
    async ({ email }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resend-otp`, { 
                email 
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const initialState = {
    userInfo: null,
    token: null,
    status: 'idle',
    error: null,
    otpStatus: 'idle',
    otpError: null,
    resetStatus: 'idle',
    resetError: null,
    verifyStatus: 'idle',
    verifyError: null,
    resendStatus: 'idle',
    resendError: null,
    forgotPasswordEmail: null,
    isOtpVerified: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            state.otpStatus = 'idle';
            state.otpError = null;
            state.resetStatus = 'idle';
            state.resetError = null;
            state.verifyStatus = 'idle';
            state.verifyError = null;
            state.resendStatus = 'idle';
            state.resendError = null;
            state.forgotPasswordEmail = null;
            state.isOtpVerified = false;
        },
        clearOtpState: (state) => {
            state.otpStatus = 'idle';
            state.otpError = null;
            state.verifyStatus = 'idle';
            state.verifyError = null;
            state.resendStatus = 'idle';
            state.resendError = null;
            state.resetStatus = 'idle';
            state.resetError = null;
            state.isOtpVerified = false;
        },
        setForgotPasswordEmail: (state, action) => {
            state.forgotPasswordEmail = action.payload;
        },
        clearResetState: (state) => {
            state.resetStatus = 'idle';
            state.resetError = null;
        },
        clearError: (state) => {
            state.error = null;
            state.otpError = null;
            state.resetError = null;
            state.verifyError = null;
            state.resendError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login Cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = { 
                    email: action.payload.email, 
                    role: action.payload.role,
                    id: action.payload.id,
                    admin: action.payload.admin
                };
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            // Forgot Password Cases
            .addCase(forgotPassword.pending, (state) => {
                state.otpStatus = 'loading';
                state.otpError = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.otpStatus = 'succeeded';
                state.forgotPasswordEmail = action.meta.arg.email;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.otpStatus = 'failed';
                state.otpError = action.payload;
            })
            
            // Verify OTP Cases
            .addCase(verifyOTP.pending, (state) => {
                state.verifyStatus = 'loading';
                state.verifyError = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.verifyStatus = 'succeeded';
                state.isOtpVerified = action.payload.verified;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.verifyStatus = 'failed';
                state.verifyError = action.payload;
            })
            
            // Reset Password Cases
            .addCase(resetPassword.pending, (state) => {
                state.resetStatus = 'loading';
                state.resetError = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetStatus = 'succeeded';
                state.forgotPasswordEmail = null;
                state.isOtpVerified = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetStatus = 'failed';
                state.resetError = action.payload;
            })
            
            // Resend OTP Cases
            .addCase(resendOTP.pending, (state) => {
                state.resendStatus = 'loading';
                state.resendError = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.resendStatus = 'succeeded';
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.resendStatus = 'failed';
                state.resendError = action.payload;
            });
    },
});

export const { 
    logout, 
    clearOtpState, 
    setForgotPasswordEmail, 
    clearResetState,
    clearError 
} = userSlice.actions;

export default userSlice.reducer;