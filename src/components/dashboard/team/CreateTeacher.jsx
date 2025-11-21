"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { createTeacher, resetCreateTeacherState } from "@/redux/slices/teacherSlices/teacherSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";

const CreateTeacher = () => {
    const dispatch = useDispatch();

    const classNames = useSelector((state) => state.getAllClassesName.classNames);
    const classesLoading = useSelector((state) => state.getAllClassesName.loading);
    const classesError = useSelector((state) => state.getAllClassesName.error);
    const teacherStatus = useSelector((state) => state.createTeacher.status);
    const teacherError = useSelector((state) => state.createTeacher.error);

    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        qualification: "",
        specialization: "",
        experienceYears: "",
        hireDate: "",
        assignedClasses: "",
        subjects: "",
        languages: "",
    });

    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedClasses, setSelectedClasses] = useState([]);

    const classes = useMemo(() => {
        return Array.isArray(classNames) ? classNames : [];
    }, [classNames]);

    const genderOptions = useMemo(() => [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" }
    ], []);

    const qualificationOptions = useMemo(() => [
        { label: "B.Ed", value: "B.Ed" },
        { label: "M.Ed", value: "M.Ed" },
        { label: "B.Sc", value: "B.Sc" },
        { label: "M.Sc", value: "M.Sc" },
        { label: "PhD", value: "PhD" }
    ], []);

    const experienceYearsOptions = [
        { label: "1 year", value: "1 year" },
        { label: "2 years", value: "2 years" },
        { label: "3 years", value: "3 years" },
        { label: "4 years", value: "4 years" },
        { label: "5 years", value: "5 years" },
        { label: "6-10 years", value: "6-10 years" },
        { label: "10+ years", value: "10+ years" },
    ];

    const languagesOptions = useMemo(() => [
        { label: "English", value: "English" },
        { label: "Spanish", value: "Spanish" },
        { label: "French", value: "French" },
        { label: "German", value: "German" },
        { label: "Chinese", value: "Chinese" },
        { label: "Arabic", value: "Arabic" },
        { label: "Hindi", value: "Hindi" },
        { label: "Urdu", value: "Urdu" },
    ], []);

    useEffect(() => {
        dispatch(getAllClassesNameAction());
    }, [dispatch]);

    useEffect(() => {
        if (teacherStatus === "succeeded") {
            setFormData({
                fullName: "",
                gender: "",
                dateOfBirth: "",
                address: "",
                phone: "",
                email: "",
                password: "",
                qualification: "",
                specialization: "",
                experienceYears: "",
                hireDate: "",
                assignedClasses: "",
                subjects: "",
                languages: "",
            });
            setSelectedClasses([]);

            setTimeout(() => {
                dispatch(resetCreateTeacherState());
            }, 3000);
        }
    }, [teacherStatus, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const toggleDropdown = useCallback((name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    }, []);

    const selectOption = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setOpenDropdown(null);
    }, []);

    const handleClassSelection = useCallback((classId, className) => {
        setSelectedClasses(prev => {
            const isAlreadySelected = prev.find(cls => cls.id === classId);

            if (isAlreadySelected) {
                const updated = prev.filter(cls => cls.id !== classId);
                // Update form data separately to avoid re-render during typing
                setTimeout(() => {
                    const classNames = updated.map(cls => cls.name).join(", ");
                    setFormData(prevForm => ({
                        ...prevForm,
                        assignedClasses: classNames
                    }));
                }, 0);
                return updated;
            } else {
                const updated = [...prev, { id: classId, name: className }];
                setTimeout(() => {
                    const classNames = updated.map(cls => cls.name).join(", ");
                    setFormData(prevForm => ({
                        ...prevForm,
                        assignedClasses: classNames
                    }));
                }, 0);
                return updated;
            }
        });
    }, []);

    const handleLanguageToggle = useCallback((language) => {
        setFormData(prev => {
            const currentLanguages = prev.languages ? prev.languages.split(",").map(lang => lang.trim()).filter(lang => lang) : [];
            const languageIndex = currentLanguages.indexOf(language);

            if (languageIndex > -1) {
                currentLanguages.splice(languageIndex, 1);
            } else {
                currentLanguages.push(language);
            }

            return {
                ...prev,
                languages: currentLanguages.join(", ")
            };
        });
    }, []);

    const isClassSelected = useCallback((classId) => {
        return selectedClasses.some(cls => cls.id === classId);
    }, [selectedClasses]);

    const isLanguageSelected = useCallback((language) => {
        return formData.languages ? formData.languages.split(",").map(lang => lang.trim()).includes(language) : false;
    }, [formData.languages]);

    const getSelectedLanguagesDisplay = useCallback(() => {
        return formData.languages || "Select languages";
    }, [formData.languages]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const { fullName, email, password, phone } = formData;
        if (!fullName || !email || !password || !phone) {
            alert("Full name, email, password, and phone are required.");
            return;
        }

        const payload = {
            ...formData,
            assignedClasses: selectedClasses.map(cls => cls.id),
            assignedClassIds: selectedClasses.map(cls => cls.id),
            subjects: formData.subjects
                ? formData.subjects.split(",").map((item) => item.trim())
                : [],
            languages: formData.languages
                ? formData.languages.split(",").map((item) => item.trim())
                : [],
        };

        console.log("Submitting payload:", payload);
        dispatch(createTeacher(payload));
    }, [formData, selectedClasses, dispatch]);

    const StyledDateField = useCallback(({ label, name, value, onChange, placeholder, required = false, className = "" }) => {
        return (
            <div className={className}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && "*"}
                </label>
                <input
                    type="date"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 [color-scheme:light]"
                />
            </div>
        );
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">
                Welcome to
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">
                MaktabOS
            </p>

            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
                <h2 className="text-lg font-semibold mb-6 text-[#000000]">
                    Create Teacher
                </h2>

                {/* Status Messages */}
                {teacherStatus === "loading" && (
                    <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
                        <p className="font-semibold">Creating teacher...</p>
                    </div>
                )}

                {teacherStatus === "succeeded" && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        <p className="font-semibold">Teacher created successfully!</p>
                        <p>Teacher account has been created with assigned classes.</p>
                    </div>
                )}

                {teacherError && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <p className="font-semibold">Error:</p>
                        <p>{teacherError}</p>
                    </div>
                )}

                {/* Classes Loading/Error Messages */}
                {classesLoading && (
                    <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
                        <p className="font-semibold">Loading classes...</p>
                    </div>
                )}

                {classesError && (
                    <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                        <p className="font-semibold">Warning:</p>
                        <p>Could not load classes - {classesError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <FormInput
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            required={true}
                        />

                        {/* Gender Dropdown */}
                        <SimpleDropdown
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            options={genderOptions}
                            onSelect={selectOption}
                            isOpen={openDropdown === "gender"}
                            onToggle={toggleDropdown}
                            placeholder="Select gender"
                        />

                        {/* Date of Birth */}
                        <StyledDateField
                            label="Date of Birth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            placeholder="MM-DD-YYYY"
                        />

                        {/* Address */}
                        <FormInput
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                        />

                        {/* Phone */}
                        <FormInput
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            required={true}
                        />

                        {/* Email */}
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            required={true}
                        />

                        {/* Password */}
                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required={true}
                        />

                        {/* Qualification Dropdown */}
                        <SimpleDropdown
                            label="Qualification"
                            name="qualification"
                            value={formData.qualification}
                            options={qualificationOptions}
                            onSelect={selectOption}
                            isOpen={openDropdown === "qualification"}
                            onToggle={toggleDropdown}
                            placeholder="Select qualification"
                        />

                        {/* Specialization */}
                        <FormInput
                            label="Specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            placeholder="e.g. Mathematics"
                        />

                        {/* Experience Years Dropdown */}
                        <SimpleDropdown
                            label="Experience (Years)"
                            name="experienceYears"
                            value={formData.experienceYears}
                            options={experienceYearsOptions}
                            onSelect={selectOption}
                            isOpen={openDropdown === "experienceYears"}
                            onToggle={toggleDropdown}
                            placeholder="Select years"
                        />

                        {/* Hire Date */}
                        <StyledDateField
                            label="Hire Date"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleInputChange}
                            placeholder="MM-DD-YYYY"
                        />

                        {/* Assigned Classes Multi-Select Dropdown */}
                        <MultiSelectDropdown
                            label="Assigned Classes"
                            name="assignedClasses"
                            value={formData.assignedClasses}
                            options={classes}
                            isOpen={openDropdown === "assignedClasses"}
                            onToggle={toggleDropdown}
                            placeholder={classesLoading ? "Loading classes..." : "Select classes"}
                            onItemToggle={handleClassSelection}
                            isItemSelected={isClassSelected}
                            getDisplayValue={() => selectedClasses.map(cls => cls.name).join(", ") || "Select classes"}
                            disabled={classesLoading}
                        />

                        <FormInput
                            label="Subjects"
                            name="subjects"
                            value={formData.subjects}
                            onChange={handleInputChange}
                            placeholder="e.g. English, Math"
                        />

                        <MultiSelectDropdown
                            label="Languages"
                            name="languages"
                            value={formData.languages}
                            options={languagesOptions}
                            isOpen={openDropdown === "languages"}
                            onToggle={toggleDropdown}
                            placeholder="Select languages"
                            onItemToggle={handleLanguageToggle}
                            isItemSelected={isLanguageSelected}
                            getDisplayValue={getSelectedLanguagesDisplay}
                        />
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={teacherStatus === "loading" || classesLoading}
                            className={`rounded-full px-8 py-3 text-sm font-semibold ${teacherStatus === "loading" || classesLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
                                }`}
                        >
                            {teacherStatus === "loading" ? "Creating Teacher..." :
                                classesLoading ? "Loading Classes..." :
                                    "Create Teacher"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeacher;