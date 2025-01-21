import Swal from "sweetalert2";

export const swalInstance = Swal.mixin({
  customClass: {
    popup: "dark:bg-gray-800 dark:text-white bg-white text-black",
    confirmButton: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
  },
  buttonsStyling: false,
  didOpen: (popup) => {
    if (document.documentElement.classList.contains("dark")) {
      popup.style.backgroundColor = "#2d3748"; // Dark mode background
      popup.style.color = "#ffffff"; // Dark mode text color
    } else {
      popup.style.backgroundColor = "#ffffff"; // Light mode background
      popup.style.color = "#000000"; // Light mode text color
    }
  },
});

export default swalInstance;
