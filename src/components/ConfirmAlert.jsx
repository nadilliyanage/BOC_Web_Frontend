import Swal from "sweetalert2";

const ConfirmAlert = async ({ title, text }) => {
  try {
    const result = await Swal.fire({
      title: title || "Are you sure?",
      text: text || "Do you want to proceed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
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

    return result.isConfirmed;
  } catch (error) {
    console.error("Error with confirmation:", error);
    return false;
  }
};

export default ConfirmAlert;
