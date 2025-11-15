"use client";
import { CustomField } from "@/components/CustomField";
import { DropdownField } from "@/components/DropdownField";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Page = () => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        subject: "",
        description: "",
        teacherId: "",
        startDate: "",
        endDate: ""
    });
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTeachers, setFetchingTeachers] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        // API COMMENTED OUT FOR UI TESTING - Using mock data
        // fetchTeachers();
        setTeachers([
            { _id: "1", id: "1", fullName: "John Doe", specialization: "Mathematics" },
            { _id: "2", id: "2", fullName: "Jane Smith", specialization: "English" },
            { _id: "3", id: "3", fullName: "Ahmed Ali", specialization: "Science" },
            { _id: "4", id: "4", fullName: "Fatima Khan", specialization: "History" },
        ]);
        setFetchingTeachers(false);
    }, []);

    // API COMMENTED OUT FOR UI TESTING
    // const fetchTeachers = async () => {
    //     setFetchingTeachers(true);
    //     try {
    //         const response = await axios.post('/api/teacher/getTeachersName');

    //         if (response.data) {
    //             setTeachers(response.data.teachers || []);
    //         } else {
    //             alert(response.data.message || 'Error fetching teachers');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching teachers:', error);
    //         alert('Error fetching teachers');
    //     } finally {
    //         setFetchingTeachers(false);
    //     }
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDropdownToggle = (name) => {
        setDropdownOpen(prev => prev === name ? null : name);
    };

    const handleDropdownSelect = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setDropdownOpen(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.subject || !formData.teacherId) {
            alert('Please fill all required fields: Name, Subject, and Teacher');
            setLoading(false);
            return;
        }

        try {
            // API COMMENTED OUT FOR UI TESTING - Simulating success
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
            
            // const classData = {
            //     name: formData.name,
            //     code: formData.code,
            //     subject: formData.subject,
            //     description: formData.description,
            //     teacherId: formData.teacherId,
            //     startDate: formData.startDate || undefined,
            //     endDate: formData.endDate || undefined
            // };

            // const response = await axios.post('/api/teacher/createClass', classData);

            // if (response.status === 201) {
                alert('Class created successfully! (UI Testing Mode)');
                setFormData({
                    name: "",
                    code: "",
                    subject: "",
                    description: "",
                    teacherId: "",
                    startDate: "",
                    endDate: ""
                });
            // } else {
            //     alert(response.data.message || 'Error creating class');
            // }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                alert(error.response.data.message || 'Error creating class');
            } else {
                alert('Error creating class');
            }
        } finally {
            setLoading(false);
        }
    };

    const getSelectedTeacherName = () => {
        if (!formData.teacherId) return "";
        const selectedTeacher = teachers.find(teacher => teacher._id === formData.teacherId);
        return selectedTeacher ? `${selectedTeacher.fullName} - ${selectedTeacher.specialization}` : "";
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">Welcome to</h1>
            <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">MaktabOS</p>

            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
                <h2 className="text-sm font-semibold mb-6 text-gray-700">Create Class</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CustomField
                        label="Class Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Class Name"
                        required={true}
                    />

                    <CustomField
                        label="Subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                        required={true}
                    />

                    <DropdownField
                        label="Teacher"
                        name="teacherId"
                        value={getSelectedTeacherName()}
                        options={teachers}
                        onSelect={handleDropdownSelect}
                        isOpen={dropdownOpen === "teacherId"}
                        onToggle={handleDropdownToggle}
                        placeholder={fetchingTeachers ? "Loading teachers..." : "Select a teacher"}
                        required={true}
                    />

                    <CustomField
                        label="Class Code"
                        name="code"
                        type="text"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="Class Code (optional)"
                    />

                    <div className="sm:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Class Description (optional)"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full bg-[#0B4B3199] text-white placeholder-gray-300 rounded-2xl px-4 py-4 outline-none resize-none"
                        />
                    </div>

                    <CustomField
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                    />

                    <CustomField
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                    />
                </form>

                <div className="flex justify-center mt-10">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || fetchingTeachers}
                        className={`bg-[#cedbd6] text-green-900 font-semibold px-8 py-3 rounded-full hover:bg-green-300 transition w-full sm:w-auto ${
                            loading || fetchingTeachers ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Creating Class...' : 'Create Class'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;