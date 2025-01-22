import Swal from "sweetalert2";

const ErrorAlert = ({ icon, title, text }) => {
  Swal.fire({
    icon: icon || "error", // Default to error if icon is not passed
    title: title,
    text: text,
    confirmButtonColor: "#d33",
    customClass: {
      popup:
        "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
      title: "dark:text-yellow-400 font-bold text-xl",
      htmlContainer: "dark:text-gray-300",
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
      cancelButton:
        "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
    },
  });
};

export default ErrorAlert;
