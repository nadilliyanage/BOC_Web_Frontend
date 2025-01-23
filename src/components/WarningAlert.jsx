import Swal from "sweetalert2";

const WarningAlert = ({ icon, title, text }) => {
  Swal.fire({
    icon: icon || "warning", // Default to warning if icon is not passed
    title: title,
    text: text,
    confirmButtonColor: "#3085d6",
    customClass: {
      popup:
        "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
      title: "dark:text-yellow-400 font-bold text-xl",
      htmlContainer: "dark:text-gray-300",
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
    },
  });
};

export default WarningAlert;
