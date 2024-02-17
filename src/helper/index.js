import moment from "moment";

export const dateTimeLao = (today) => {
    var todays = moment(today).format("DD/MM/YYYY");
    return todays === "Invalid date" ? "-" : todays;
};
export const formatDate = (today) => {
    var todays = moment(today).format("YYYY/MM/DD");
    return todays === "Invalid date" ? "-" : todays;
};

export const currency = (value) => {
    let currencies = new Intl.NumberFormat("en-CA").format(value);
    if (value !== 0) return currencies;
    else if (value === 0) return "0";
    else return "";
};

export const convertRole = (role) => {
    let res = "";
    switch (role) {
        case "ADMIN":
            res = "ແອັດມິນ"
            break;
        case "STAFF_STOCK":
            res = "ພະນັກງານສາງ"
            break;
        case "STAFF":
            res = "ຊ່າງ"
            break;
        case "COUNTER":
            res = "ພະນັກງານເຄົ້າເຕີ້"
            break;
        case "CUSTOMER":
            res = "ສະມາຊິກ"
            break;
        case "MANAGER_REPORT":
            res = "ຜູ້ຕິດຕາມ"
            break;
    
        default:
            res = "ແອັດມິນ"
            break;
    }
    return res;
}

export const convertErrorMessage = (mes) => {
    let res = "";
    switch (mes) {
        case "NAME_IS_READY":
            res = "ຊື່ນີ້ມີຢູ່ແລ້ວ"
            break;
        case "PRODUCT_IS_NOT_ENOUGH":
            res = "ສິນຄ້າບໍ່ພຽງພໍ"
            break;
        case "USERID_IS_NOT_READY":
            res = "ມີຊື່ພະນັກງານນີ້ແລ້ວໃນລະບົບ!"
            break;
        case "USER_WITH_PHONE_IS_READY_EXIST":
            res = "ມີເບີໂທນີ້ໃນລະບົບແລ້ວ!"
            break;
    
        default:
            res = ""
            break;
    }
    return res;
}

export const convertFunctionName = (role) => {
    let res = "";
    switch (role) {
        case "DASHBOARD":
            res = "ລາຍງານລວມ"
            break;
        case "BILL":
            res = "ເປີດບິນ"
            break;
        case "PRODUCT":
            res = "ຈັດການຂໍ້ມູນສິນຄ້າ"
            break;
        case "SERVICE":
            res = "ຈັດການຂໍ້ມູນບໍລິການ"
            break;
        case "EXPENDITURE":
            res = "ລາຍຈ່າຍ"
            break;
        case "USER":
            res = "ຜູ້ໃຊ້ລະບົບ"
            break;
        case "ENTRY_EXIT":
            res = "ການເຂົ້າ-ອອກ"
            break;
        case "ABSENT":
            res = "ການຄອບພັກວຽກ"
            break;
        case "PROMOTION":
            res = "Promotion"
            break;
        case "DUTY":
            res = "ຈັດການ ອ.ມ.ພ"
            break;
        case "CUSTOMER":
            res = "ຈັດການສະມາຊິກ"
            break;
    
        default:
            res = ""
            break;
    }
    return res;
}
export const convertGender = (role) => {
    let res = "";
    switch (role) {
        case "MALE":
            res = "ຊາຍ"
            break;
        case "FEMALE":
            res = "ຍິງ"
            break;
        default:
            res = "ຊາຍ"
            break;
    }
    return res;
}
export const toDayDash = (item) => {
    if (item) {
      const date = new Date(item);
      date.toLocaleString('en-US', { timeZone: 'Asia/Vientiane' });
      date.setHours(date.getHours()+0);
      return moment(date).format("DD/MM/YYYY HH:MM:SS");
    } else {
      return "-";
    }
  };