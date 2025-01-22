import Swal from "sweetalert2";

const ConfirmDialog = async ({ title, text, icon }) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6", // Use hex color for custom colors
    cancelButtonColor: "#d33", // Hex color for cancel button
    confirmButtonText: "Yes, confirm!",
    customClass: {
      popup:
        "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg", // Modal container
      title: "dark:text-yellow-400 font-bold text-xl", // Title
      htmlContainer: "dark:text-gray-300", // Text content
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded", // Confirm button
      cancelButton:
        "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded", // Cancel button
    },
  });

  return result;
};

export default ConfirmDialog;
