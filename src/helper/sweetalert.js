import Swal from "sweetalert2";
export const Success = (item) => {
  Swal.fire({
    icon: "success",
    title: item,
    showConfirmButton: false,
    timer: 2000,
  });
};
export const Error = (item) => {
  Swal.fire({
    icon: "error",
    text: errorCass(item?.message),
    showConfirmButton: false,
    timer: 2000,
  });
};
export const Warring = (item) => {
  Swal.fire({
    icon: "warning",
    text: item,
    showConfirmButton: false,
    timer: 2000,
  });
};

const errorCass = (item) => {
  return item === "NAME_IS_READY"
    ? "ຊື່ໝວດລາຍຈ່າຍນີ້ມີແລ້ວ"
    : "ລະບົບມີປັນຫາ";
};
