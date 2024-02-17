import { toast } from "react-toastify";

export const customizeToast = (type, title) => {
    let notify

    switch (type) {
        case "success":
            notify = toast.success(title);
            break;
        case "error":
            notify = toast.error(title);
            break;
        case "warning":
            notify = toast.warning(title);
            break;
        case "default":
            notify = toast.default(title);
            break;
        case "info":
            notify = toast.info(title);
            break;
        default:
            notify = toast(title);
            break;
    }

    return notify;
};