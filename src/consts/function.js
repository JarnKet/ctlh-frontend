import moment from "moment";



export const ConcertPayMethod=(data)=>{
if(data ==="PAY_CASH"){
    return "ເງີນສົດ"
}
if(data ==="PAY_ONLINE"){
    return "ເງີນໂອນ"
}
if(data ==="CASH_AND_ONLINE"){
    return "ເງີນສົດ ແລະ ເງີນໂອນ"
}
return"-"
}

export const currencyFormat = (value) => {
    let currencys = new Intl.NumberFormat("en-CA").format(value);
    if(value!== 0)return currencys;
    else if(value === 0) return "0"
    else return ""
  };
  export const formatDateDash = (dashDate) => {
    let resp = moment(dashDate).format("YYYY-MM-DD");
    return resp;
  };
  export const RandomNumBer = () => {
  var dateNow = formatDateDash(new Date());
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return "AC-" + moment(dateNow).format('YYMMDD') + "-" + result
  }