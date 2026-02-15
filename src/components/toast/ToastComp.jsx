import { toast } from "react-toastify";

const ToastComp = ({ variant, message }) => {
  switch (variant) {
    case "success":
      toast.success(message, {
        position: "bottom-right",
        className: "foo-bar",
        autoClose: 2000,
        pauseOnHover: false,
      });
      break;
    case "error":
      toast.error(message, {
        position: "bottom-right",
        className: "foo-bar",
        autoClose: 15000,
        pauseOnHover: true,
      });

      break;
    case "warn":
      toast.warn(message, {
        position: "bottom-right",
        className: "foo-bar",
        autoClose: 2000,
        pauseOnHover: false,
      });

      break;
    case "info":
      toast.info(message, {
        position: "bottom-right",
        className: "foo-bar",
        autoClose: 2000,
        pauseOnHover: false,
      });

      break;

    default:
      break;
  }
};

export default ToastComp;
