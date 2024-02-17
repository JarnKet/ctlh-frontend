import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { useHistory, useRouteMatch } from "react-router-dom";

/**
 * @Component
 */
import {
  Form,
  Col,
  Row,
  Spinner,
  Modal,
  Button,
  Card,
} from "react-bootstrap";
/**
 * @Constant
 */
/**
 * @Apollo
 */
import { GET_BILL, GET_ORDER_BILLS } from "../../apollo/bill/Query";
import { GET_USER, GET_USERS } from "../../apollo/user/Query";
/**
 * @Function
 */
import { currency } from "../../helper/index";
import { GET_PROMOTION_LIST } from "../promotion/apollo/query";
import _ from "lodash";
import moment from "moment";
import { GET_DUTYS } from "../../apollo/duty";
import { NumericFormat } from "react-number-format";
import { CHECK_BILL, DELETE_BILL, UPDATE_ORDER_BILL } from "../../apollo/bill/Mutation";
import { customizeToast } from "../../helper/toast";
import { OPEN_BILL } from "../../consts/router";
import PrintBillCourse from "./PrintBillCourse";
import { USER_KEY } from "../../consts";

export default function SellCourse() {
  const history = useHistory();
  const match = useRouteMatch();
  const billId = match?.params?.id;
  const [dataOrderCourse, setDataOrderCourse] = useState([]);
  const [checkoutArray, setCheckoutArray] = useState([])
  const [activeCourse, setActiveCourse] = useState();
  const [activeCourseId, setActiveCourseId] = useState();
  const [dataStaff, setDataStaff] = useState([])
  const [dataPromotion, setDataPromotion] = useState([])

  const [price, setPrice] = useState(0)
  const [promotionId, setPromotionId] = useState('')
  const [promotionPrice, setPromotionPrice] = useState(0)
  const [dutyPrice, setDutyPrice] = useState(0)
  const [dutyPercent, setDutyPercent] = useState(0);
  const [discount, setDiscount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0);
  const [normalSalary, setNormalSalary] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PAY_CASH')
  const [customerPayMoney, setCustomerPayMoney] = useState(0)
  const [customerPayMoneyCash, setCustomerPayMoneyCash] = useState(0)
  const [customerPayMoneyOnline, setCustomerPayMoneyOnline] = useState(0)
  const [tipCash, setTipCash] = useState(0)
  const [tipOnline, setTipOnline] = useState(0)

  const [staffId, setStaffId] = useState()
  const [staffName, setStaffName] = useState()
  const [showModalStaff, setShowModalStaff] = useState(false)

  const [isShowDelete, setIsShowDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmUserNO, setShowConfirmUserNO] = useState(false);

  const [dataUserNo, setDataUserNo] = useState()
  const [userNo, setUserNo] = useState()

  const handleShowModalStaff = () => setShowModalStaff(true)
  const handleCloseModalStaff = () => setShowModalStaff(false)

  const handleCloseCheckBill = () => setShowConfirm(false);
  const handleShowCheckBill = () => setShowConfirm(true);
  
  const handleCloseUserNO = () => setShowConfirmUserNO(false);
  const handleShowUserNO = () => setShowConfirmUserNO(true);

  const [loadDataBill, { data: apolloDataBill }] = useLazyQuery(GET_BILL, { fetchPolicy: "network-only" });
  const [loadDataOderCourse, { data: apolloDataOrderCourse, loading: orderCourseLoading }] = useLazyQuery(GET_ORDER_BILLS, { fetchPolicy: "network-only" });
  const [loadDataUsers, { data: apolloDataUsers }] = useLazyQuery(GET_USERS, {fetchPolicy: "network-only"});
  const [getPromotions, { data: apolloDataPromotion }] = useLazyQuery(GET_PROMOTION_LIST,{ fetchPolicy: "network-only" });
  const [loadDataDuty, { data: apolloDataDuty }] = useLazyQuery(GET_DUTYS, {fetchPolicy: "network-only"});

  const [updateOrderCourse] = useMutation(UPDATE_ORDER_BILL)
  const [updateBill] = useMutation(CHECK_BILL)
  const [deleteBill] = useMutation(DELETE_BILL)

  const [loadDataUserNo, { data: apolloDataUserNo }] = useLazyQuery(GET_USER, { fetchPolicy: "network-only" });

  const getDataFromLocal = async () => {
    try {
      const _resData = await localStorage.getItem(USER_KEY)
      const _localJson = JSON.parse(_resData)

      if (_localJson?.data) {
        loadDataUserNo({
          variables: {
            where: { id: _localJson?.data?.id }
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataFromLocal()
    loadDataUsers({ variables: { where: { role: "STAFF" } } });
    getPromotions();
    loadDataDuty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    loadDataBill({ variables: { where: { id: billId } } });
    getOrderCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

  const getOrderCourse = () => {
    loadDataOderCourse({ 
      variables: { 
        where: { billId: billId },
        orderBy: "no_ASC"
      } 
    });
  }

  useEffect(() => {
    if(apolloDataUserNo) setDataUserNo(apolloDataUserNo?.user?.userNo)
  }, [apolloDataUserNo]);

  useEffect(() => {
    if (apolloDataOrderCourse) {
      let newData = apolloDataOrderCourse?.OrderBills?.data
      let checkout = []
      setDataOrderCourse(newData);
      for (let i = 0; i < newData?.length; i++) {
        if (newData[i]?.status === "CHECK_OUT"){
          checkout.push(newData[i]?.no)
        }
        else if (newData[i]?.status === "TODO") {
          setActiveCourse(newData[i]?.no);
          setActiveCourseId(newData[i]?.id);
          setPrice(newData[i]?.amount)
          setStaffId(newData[i]?.staff?.id)
          setStaffName(newData[i]?.staff?.fullName)
        }
      }
      setCheckoutArray(checkout)
    }
  }, [apolloDataOrderCourse]);

  useEffect(() => {
    if(apolloDataUsers) {
      setDataStaff(apolloDataUsers?.users?.data)
    }
  }, [apolloDataUsers]);

  useEffect(() => {
    if(apolloDataPromotion) {
      setDataPromotion(apolloDataPromotion?.promotions?.data)
    }
  }, [apolloDataPromotion]);

  useEffect(() => {
    if(apolloDataDuty) {
      let dutyAmount = price * apolloDataDuty?.duties?.data[0]?.amount / 100
      setDutyPrice(dutyAmount)
      setDutyPercent(apolloDataDuty?.duties?.data[0]?.amount)
    }
  }, [apolloDataDuty, price]);

  useEffect(() => {
    setFinalAmount(price + promotionPrice + dutyPrice - discount)
  }, [price, promotionPrice, dutyPrice, discount]);

  const _confirmStaff = async () => {
    try {
      const _update = await updateOrderCourse({
        variables: {
          where: { id: activeCourseId },
          data: { staff: staffId }
        }
      })
      if (_update?.data?.updateOrderBill?.id) {
        customizeToast("success", "ເພີ່ມຊ່າງສຳເລັດ")
      }
      getOrderCourse()
      handleCloseModalStaff()
      // history.push(OPEN_BILL)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const handleChangePromotion = e => {
    setPromotionId(e.target.value)
    if (e.target.value) {
      const _index = _.findIndex(dataPromotion, { id: e.target.value })
      setPromotionPrice(dataPromotion[_index]?.discount)
    }else {
      setPromotionPrice(0)
    }
  }

  const _onSelectNormalSalary = (value) => {
    setNormalSalary(value)
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setDiscount(_normalSalary)
  }

  const _onInputCustomerPayMoney = (value) => {
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setCustomerPayMoney(_normalSalary)
  }
  const _onInputCustomerPayMoneyCash = (value) => {
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setCustomerPayMoneyCash(_normalSalary)
  }
  const _onInputCustomerPayMoneyOnline = (value) => {
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setCustomerPayMoneyOnline(_normalSalary)
  }
  const _onInputTipCash = (value) => {
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setTipCash(_normalSalary)
  }
  const _onInputTipOnline = (value) => {
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setTipOnline(_normalSalary)
  }

  const _confirmDeleteBill = async () => {
    try {
      const cancelBill = await deleteBill({ variables: { where: { id: billId } } });
      if (cancelBill?.data?.deleteBill?.id) {
        customizeToast("success", "ຍົກເລີກບິນສຳເລັດ")
        history.push(OPEN_BILL)
      }
    } catch (error) {
      console.log(error)
      customizeToast("error", "ຍົກເລີກບິນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
  }

  const _checkUserNo = () => {
    if(!dataUserNo) {
      customizeToast("warning", "ທ່ານຍັງບໍ່ມີລະຫັດປະຈຳໂຕ ກະລຸນາເພີ່ມລະຫັດປະຈຳໂຕກ່ອນ!")
      return;
    }
    if(dataUserNo === userNo) {
      handleCloseUserNO()
      handleShowCheckBill()
    }else {
      customizeToast("warning", "ລະຫັດປະຈຳໂຕບໍ່ຖືກຕ້ອງ!")
    }
  }

  const _checkBill = async () => {
    try {
      if(!staffId) {
        customizeToast("warning", "ເລືອກຊ່າງກ່ອນ!")
        return
      }

      if(paymentMethod === "CASH_AND_ONLINE") {
        if((!customerPayMoneyCash || !customerPayMoneyOnline) && activeCourse === '1') {
          customizeToast("warning", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!")
          return;
        }
        if(parseInt(customerPayMoneyCash) + parseInt(customerPayMoneyOnline) < parseInt(finalAmount)) {
          customizeToast("warning", "ເງິນທີ່ລູກຄ້າຈ່າຍຍັງບໍ່ຄົບຕາມຈຳນວນເງິນທັງໝົດທີ່ຕ້ອງຊຳລະ!")
          return;
        }
      }else {
        if(!customerPayMoney && activeCourse === '1')  {
          customizeToast("warning", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!")
          return;
        }
        if(parseInt(customerPayMoney) < parseInt(finalAmount))  {
          customizeToast("warning", "ເງິນທີ່ລູກຄ້າຈ່າຍຍັງບໍ່ຄົບຕາມຈຳນວນເງິນທັງໝົດທີ່ຕ້ອງຊຳລະ!")
          return;
        }
      }
      
      let _newData = {}
      if(activeCourse === '1') {
        if(paymentMethod === "CASH_AND_ONLINE") {
          _newData = {
            no: parseInt(activeCourse),
            status: "WAITING",
            discount: discount,
            paymentMethod: paymentMethod,
            promotionId: promotionId,
            promotionAmount: promotionPrice,
            dutyAmount: dutyPrice,
            amountCash: customerPayMoneyCash,
            amountOnline: customerPayMoneyOnline,
            tipCash: tipCash,
            tipOnline: tipOnline,
          }
        }else {
          _newData = {
            no: parseInt(activeCourse),
            status: "WAITING",
            discount: discount,
            paymentMethod: paymentMethod,
            promotionId: promotionId,
            promotionAmount: promotionPrice,
            dutyAmount: dutyPrice,
            tipCash: tipCash,
            tipOnline: tipOnline,
            amountCash:paymentMethod ==="PAY_CASH" ? customerPayMoney:0,
            amountOnline: paymentMethod ==="PAY_ONLINE" ? customerPayMoney:0,
          }
        }
      }else if(activeCourse === dataOrderCourse?.length) {
        _newData = {
          no: parseInt(activeCourse),
          status: "CHECK_OUT",
        }
      }else {
        _newData = {
          no: parseInt(activeCourse),
          status: "WAITING",
          amountCash: customerPayMoneyCash,
          amountOnline: customerPayMoneyOnline,
        }
      }
      if (promotionId === '') delete _newData?.promotionId
      const _update = await updateBill({
        variables: {
          where: { id: match?.params?.id },
          data: _newData
        }
      })
      if (_update?.data?.checkOutBill?.id) {
        customizeToast("success", "ເຊັກບິນສຳເລັດ")
        document.getElementById('btn-auto-click').click()
        history.push(OPEN_BILL)
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <div>
      <Row>
        <Col md="8">
          <div className="category-card">
            <h4 className="text-primary mb-5">
              <b>
                {`ລູກຄ້າ: ${
                  apolloDataBill && apolloDataBill?.bill?.customer ? apolloDataBill?.bill?.customer?.fullName : ''
                } (${
                  dataOrderCourse && dataOrderCourse?.length > 0
                    ? dataOrderCourse?.[0]?.billId?.numberTable
                    : ""
                })`}{" "}
              </b>
            </h4>
          </div>
          <div className="select-menu">
            <h3>ຈຳນວນຄອສທັງໝົດ</h3>
            {orderCourseLoading ? (
              <div className="loading-page">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Row>
                {dataOrderCourse &&
                  dataOrderCourse?.map((item, index) => (
                    <Col md={2} className="mb-3">
                      <Button
                        key={index}
                        className={`card-sell-course ${
                          checkoutArray?.includes(item?.no)
                          ? "success-course"
                          : activeCourse === item?.no ? "doing-course" : ""
                        }`}
                        disabled={activeCourse === item?.no ? false : true}
                        onClick={handleShowModalStaff}
                      >
                        <i></i>
                        <div
                          style={{
                            color: "#fff",
                            zIndex: 2,
                            position: "absolute",
                            top: 25,
                            left: 20,
                            fontWeight: 300,
                          }}
                        >
                          {currency(item?.amount)} ກີບ
                        </div>
                        {item?.serviceName} <br />
                        ຄັ້ງທີ {item?.no} <br />
                        <span className="text-success">{checkoutArray?.includes(item?.no) ? 'ສຳເລັດແລ້ວ' : ''}</span>
                        <span className="text-danger">{activeCourse === item?.no ? 'ກຳລັງເຮັດຢູ່' : ''}</span>
                      </Button>
                    </Col>
                  ))}
              </Row>
            )}
          </div>
        </Col>

        <Col md="4">
          <div className="category-card">
            <div style={{ marginTop: 20 }}>
              <Form.Group>
                <Form.Label>ໂປຣໂມຊັ່ນ</Form.Label>
                <Form.Select
                  as="select"
                  placeholder="ກະລຸນາເພີ່ມ"
                  name="promotionId"
                  onChange={handleChangePromotion}
                  disabled={activeCourse === 1 ? false : true}
                >
                  <option value="">ບໍ່ມີ</option>
                  {dataPromotion?.map((item, index) => {
                    let stDate = moment(item?.startDate).diff(moment(), "day");
                    let eDate = moment(item?.endDate).diff(moment(), "day");
                    return (
                      <option
                        style={{
                          display: stDate <= 0 && eDate > 0 ? "block" : "none",
                        }}
                        key={index}
                        value={item?.id}
                      >
                        {item?.code} ({currency(item?.discount)}{" "}
                        {item?.typePromotion === "MONEY" ? "ກີບ" : "%"})
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>ເງິນສ່ວນຫຼຸດ</Form.Label>
                <NumericFormat
                  name="normalSalary"
                  className="form-control"
                  onChange={(e) => _onSelectNormalSalary(e.target.value)}
                  value={normalSalary ?? ""}
                  placeholder="ປ້ອນເງິນສ່ວນຫຼຸດ"
                  disabled={activeCourse === 1 ? false : true}
                  thousandSeparator={true}
                />
              </Form.Group>
              <Card style={{ marginTop: 30, padding: 20 }}>
                <Row>
                  <Col md={7} style={{ textAlign: "start" }} colSpan={2}>
                    ຊ່າງ:
                  </Col>
                  <Col md={5} style={{ textAlign: "end" }}>
                    {" "}
                    {staffName ?? '-'}
                  </Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: "start" }} colSpan={2}>
                    ລາຄາ:
                  </Col>
                  <Col md={5} style={{ textAlign: "end" }}>
                    {" "}
                    {currency(price)} ກີບ
                  </Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: "start" }} colSpan={2}>
                    ໂປຣໂມຊັ່ນ:
                  </Col>
                  <Col md={5} className="text-success" style={{ textAlign: "end" }}>
                    + {currency(promotionPrice)} ກີບ
                  </Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: "start" }} colSpan={2}>
                    ອ.ມ.ພ {dutyPercent} %:
                  </Col>
                  <Col md={5} className="text-success" style={{ textAlign: "end" }}>
                    {" "}
                    + {currency(dutyPrice)} ກີບ
                  </Col>
                </Row>
                <Row> 
                  <Col md={7} style={{ textAlign: "start" }} colSpan={2}>
                    ເງິນສ່ວນຫຼຸດ:
                  </Col>
                  <Col md={5} className="text-danger" style={{ textAlign: "end" }}>
                    - {currency(discount)} ກີບ
                  </Col>
                </Row>
                <Row>
                  <Col
                    md={7}
                    style={{ textAlign: "start", fontWeight: 700 }}
                    colSpan={2}
                  >
                    ເງິນທີ່ຕ້ອງຈ່າຍ:
                  </Col>
                  <Col md={5} style={{ textAlign: "end", fontWeight: 700 }}>
                    {" "}
                    {currency(finalAmount)} ກີບ
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="card-add-bottom">
              <button
                className="btn-cancel-web"
                onClick={() => setIsShowDelete(true)}
              >
                ຍົກເລີກບໍລິການ
              </button>
              <button
                className="btn-confirm-web"
                onClick={handleShowUserNO}
              >
                ເຊັກບິນ
              </button>
            </div>
          </div>
        </Col>
      </Row>
      <PrintBillCourse
        data={dataOrderCourse}
        amount={price}
        finalAmount={finalAmount}
        dutyPrice={dutyPrice}
        dutyPercent={dutyPercent}
        no={activeCourseId}
        allDiscount={discount}
        promotion={promotionPrice}
      />

      <Modal show={showModalStaff} onHide={handleCloseModalStaff} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>ເລືອກຊ່າງ ເພື່ອໃຫ້ບໍລິການ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              ຊ່າງ<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              as="select"
              placeholder="ກະລຸນາເພີ່ມ"
              name="firstName"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              <option value="">ກາະລຸນາເລືອກຊ່າງ</option>
              {dataStaff?.map((user, index) => (
                <option key={index} value={user?.id}>
                  {user?.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalStaff}>ຍົກເລີກ</Button>
          <Button variant="primary" onClick={_confirmStaff}>ຢືນຢັນ</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirm} onHide={handleCloseCheckBill} centered backdrop="static" size='lg'>
        <Modal.Header>
          <Modal.Title>ຢືນຢັນການເຊັກບິນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label><b>ຮູບແບບການຈ່າຍເງິນ:</b></Form.Label>
            <div className='d-flex justify-content-center py-4'>
              <Form.Check type='radio' style={{ fontSize: 28 }} defaultChecked={paymentMethod === "PAY_CASH" ? true : false} inline="true" label="ເງິນສົດ" id="PAY_CASH" name="payment" onChange={(e) => setPaymentMethod(e.target.value)} value="PAY_CASH" />
              <Form.Check type='radio' style={{ fontSize: 28, marginLeft: 20 }} defaultChecked={paymentMethod === "PAY_ONLINE" ? true : false} inline="true" label="ເງິນໂອນ" id="PAY_ONLINE" name="payment" onChange={(e) => setPaymentMethod(e.target.value)} value="PAY_ONLINE" />
              <Form.Check type='radio' style={{ fontSize: 28, marginLeft: 20 }} defaultChecked={paymentMethod === "CASH_AND_ONLINE" ? true : false} inline="true" label="ເງິນສົດ ແລະ ເງິນໂອນ" id="CASH_AND_ONLINE" name="payment" onChange={(e) => setPaymentMethod(e.target.value)} value="CASH_AND_ONLINE" />
            </div>
          </Form.Group>
          {paymentMethod === "CASH_AND_ONLINE" ?
            <>
              <Form.Group className='mb-2'>
                <Form.Label>ເງິນທີ່ລູກຄ້າຈ່າຍ (ເງິນສົດ):</Form.Label>
                <NumericFormat
                  name="customerPayMoneyCash"
                  className="form-control"
                  onChange={(e) => _onInputCustomerPayMoneyCash(e.target.value)}
                  placeholder="ປ້ອນເງິນສົດ"
                  thousandSeparator={true}
                />
                {activeCourse === '1' && customerPayMoneyCash === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label>ເງິນທີ່ລູກຄ້າຈ່າຍ (ເງິນໂອນ):</Form.Label>
                <NumericFormat
                  name="customerPayMoneyOnline"
                  className="form-control"
                  onChange={(e) => _onInputCustomerPayMoneyOnline(e.target.value)}
                  placeholder="ປ້ອນເງິນໂອນ"
                  thousandSeparator={true}
                />
                {activeCourse === '1' && customerPayMoneyOnline === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label>ເງິນທອນ:</Form.Label>
                <NumericFormat
                  className="form-control"
                  value={customerPayMoneyCash || customerPayMoneyOnline ? parseInt(customerPayMoneyCash) + parseInt(customerPayMoneyOnline) - parseInt(finalAmount) : "0"}
                  disabled
                  thousandSeparator={true}
                />
              </Form.Group>
            </>
            :
            <>
              <Form.Group className='mb-2'>
                <Form.Label>ເງິນທີ່ລູກຄ້າຈ່າຍ:</Form.Label>
                <NumericFormat
                  name="customerPayMoney"
                  className="form-control"
                  onChange={(e) => _onInputCustomerPayMoney(e.target.value)}
                  placeholder="ປ້ອນເງິນທີ່ລູກຄ້າຈ່າຍ"
                  thousandSeparator={true}
                />
                {activeCourse === '1' && customerPayMoney === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label>ເງິນທອນ:</Form.Label>
                <NumericFormat
                  className="form-control"
                  value={customerPayMoney ? parseInt(customerPayMoney) - parseInt(finalAmount) : "0"}
                  disabled
                  thousandSeparator={true}
                />
              </Form.Group>
            </>
          }
          <Form.Group className='mb-2'>
            <Form.Label>ເງິນ Tip (ເງິນສົດ):</Form.Label>
            <NumericFormat
              name="tipCash"
              className="form-control"
              onChange={(e) => _onInputTipCash(e.target.value)}
              placeholder="ປ້ອນເງິນ Tip"
              thousandSeparator={true}
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>ເງິນ Tip (ເງິນໂອນ):</Form.Label>
            <NumericFormat
              name="tipOnline"
              className="form-control"
              onChange={(e) => _onInputTipOnline(e.target.value)}
              placeholder="ປ້ອນເງິນ Tip"
              thousandSeparator={true}
            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Row className='w-100 px-0'>
            <Col>
              <Button variant="secondary" className='w-100' onClick={handleCloseCheckBill}>ຍົກເລີກ</Button>
            </Col>
            <Col>
              <Button variant="primary" className='w-100' onClick={() => _checkBill()}>ຢືນຢັນ</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal show={isShowDelete} onHide={() => setIsShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນຍົກເລີກບິນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການຍົກເລີກບິນນີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShowDelete(false)}>
            ຍົກເລີກ
          </Button>
          <Button className="bg-primary" onClick={() => _confirmDeleteBill()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmUserNO} onHide={handleCloseUserNO} centered>
        <Modal.Header closeButton>
          <Modal.Title>ກວດສອບລະຫັດປະຈຳໂຕ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>ກະລຸນາປ້ອນລະຫັດປະຈຳໂຕຂອງທ່ານເພື່ອເຊັກບິນ</Form.Label>
            <Form.Control type="text" placeholder="ປ້ອນລະຫັດປະຈຳໂຕ" name="userNo" onChange={e => setUserNo(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserNO}>
            ຍົກເລີກ
          </Button>
          <Button className='bg-primary' onClick={() => _checkUserNo()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
