import React from 'react';

const TimetableDetailCard = ({ timetableData, onEditTimetable }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#0B4B31] mb-4">Timetable Details</h2>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Class:</span>
                            <span className="text-[#0B4B31]">{timetableData.class}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Class Code:</span>
                            <span className="text-[#0B4B31]">{timetableData.classCode}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Subject:</span>
                            <span className="text-[#0B4B31]">{timetableData.subject}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Topic:</span>
                            <span className="text-[#0B4B31]">{timetableData.topic || "Not specified"}</span>
                        </div>
                    </div>
                </div>

                {/* Schedule Information */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#0B4B31] mb-4">Schedule</h2>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Day:</span>
                            <span className="text-[#0B4B31]">{timetableData.dayOfWeek}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Start Time:</span>
                            <span className="text-[#0B4B31]">{timetableData.startTime}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">End Time:</span>
                            <span className="text-[#0B4B31]">{timetableData.endTime}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Duration:</span>
                            <span className="text-[#0B4B31]">{timetableData.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Teacher Information */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#0B4B31] mb-4">Teacher Information</h2>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Teacher:</span>
                            <span className="text-[#0B4B31]">{timetableData.teacher}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Email:</span>
                            <span className="text-[#0B4B31]">{timetableData.teacherEmail}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-[#799086]">Phone:</span>
                            <span className="text-[#0B4B31]">{timetableData.teacherPhone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                    onClick={onEditTimetable}
                    className="px-6 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
                >
                    Edit Timetable
                </button>
            </div>
        </div>
    );
};

export default TimetableDetailCard;