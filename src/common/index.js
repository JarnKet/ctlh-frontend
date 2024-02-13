import moment from 'moment';

export {default as CustomButton} from './CustomButton'
export {default as Title} from './Title'

export const formateDateSlash = (slashData) => {
  let resp = moment(slashData).format("YYYY/MM/DD");
  return resp;
};
  
// ກຳນົດ ວັນທີປັດຈຸບັນ(-)
export const formatDateDash = (dashDate) => {
  let resp = moment(dashDate).format("YYYY-MM-DD");
  return resp;
};

export const formatDateDashDDMMYY = (dashDate) => {
  let resp = moment(dashDate).format("DD-MM-YYYY");
  return resp;
};

export const formateDateSlashDDMMYY = (slashData) => {
  let resp = moment(slashData).format("DD/MM/YYYY");
  return resp;
};