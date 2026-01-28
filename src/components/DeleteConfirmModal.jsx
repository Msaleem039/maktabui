import React from 'react';
import { X, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Confirmation",
    itemName,
    itemType = "item",
    description,
    warningText = "This action cannot be undone. All associated data will be permanently deleted.",
    confirmButtonText = "Delete",
    cancelButtonText = "Cancel",
    variant = "danger",
    isLoading = false,
    size = "md"
}) => {
    if (!isOpen) return null;

    const variantConfig = {
        danger: {
            icon: AlertTriangle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            titleColor: "text-red-700",
            buttonBg: "bg-red-600 hover:bg-red-700",
            borderColor: "border-red-200"
        },
        warning: {
            icon: AlertCircle,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            titleColor: "text-yellow-700",
            buttonBg: "bg-yellow-600 hover:bg-yellow-700",
            borderColor: "border-yellow-200"
        },
        info: {
            icon: Trash2,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            titleColor: "text-blue-700",
            buttonBg: "bg-blue-600 hover:bg-blue-700",
            borderColor: "border-blue-200"
        }
    };

    const sizeConfig = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg"
    };

    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className={`relative w-full ${sizeConfig[size]} rounded-[28px] bg-white shadow-2xl animate-in zoom-in-95`}>
                {/* Header */}
                <div className={`flex items-center justify-between border-b ${config.borderColor} px-6 py-4`}>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconBg}`}>
                            <IconComponent size={24} className={config.iconColor} />
                        </div>
                        <h2 className={`text-lg font-semibold ${config.titleColor}`}>
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {description ? (
                        <p className="text-sm text-gray-700 mb-2">{description}</p>
                    ) : (
                        <p className="text-sm text-gray-700 mb-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-900">{itemName}</span>
                            {itemType && ` this ${itemType}`}?
                        </p>
                    )}
                    <p className="text-xs text-red-600">
                        {warningText}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 rounded-full ${config.buttonBg} px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            confirmButtonText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;