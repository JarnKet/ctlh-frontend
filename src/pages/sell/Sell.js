
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Component
 */
import { Form, Col, Row, Table, Spinner, Modal, Button, Card } from 'react-bootstrap';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
import consts, { USER_KEY } from "../../consts/index";
/**
 * @Apollo
 */
import { GET_BILL, GET_ORDER_BILLS } from "../../apollo/bill/Query"
import { CHECK_BILL, CREATE_ORDER_BILL, DELETE_BILL, DELETE_ORDER_BILL } from "../../apollo/bill/Mutation"
import { GET_CATEGORY_SERVICES, GET_SERVICES } from '../../apollo/service/Query';
import { GET_USER, GET_USERS } from '../../apollo/user/Query';
/**
 * @Function
 */
import { currency } from '../../helper/index'
import useLocalStorage from '../../helper/useLocalStorage';
import PrintBill from './PrintBill';
import { GET_PROMOTION_LIST } from '../promotion/apollo/query';
import _ from 'lodash';
import { customizeToast } from '../../helper/toast';
import moment from 'moment';
import { GET_DUTYS } from '../../apollo/duty';
import { NumericFormat } from 'react-number-format';

export default function Sell() {
  const history = useHistory();
  const match = useRouteMatch();
  const billId = match?.params?.id

  const [promotionId, setPromotionId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PAY_CASH')
  const [normalSalary, setNormalSalary] = useState('')
  const [customerPayMoney, setCustomerPayMoney] = useState(0)
  const [customerPayMoneyCash, setCustomerPayMoneyCash] = useState(0)
  const [customerPayMoneyOnline, setCustomerPayMoneyOnline] = useState(0)
  const [tipCash, setTipCash] = useState(0)
  const [tipOnline, setTipOnline] = useState(0)

  const [finalAmountOrderBills, setFinalAmountOrderBills] = useState(0);
  const [amountWithDuty, setAmountWithDuty] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [moneyDiscount, setMoneyDiscount] = useState(0)
  const [duty, setDuty] = useState(0);
  const [dutyMoney, setDutyMoney] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [cateGoryId, setCateGoryId] = useState("");
  const [categoryData, setCategoriesData] = useState([]);
  const [usersData1, setUsersData1] = useState("");
  const [dataServices, setDataServices] = useLocalStorage("service");
  const [usersData, setUsersData] = useState([]);
  const [dataBill, setDataBill] = useState();
  const [dataOrderBills, setDataOrderBills] = useState([]);
  const [dataPromotion, setDataPromotion] = useState([])
  const [dataSelect, setDataSelect] = useState([]);
  const [dataSelect1, setDataSelect1] = useState([]);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmUserNO, setShowConfirmUserNO] = useState(false);
  const [staff, setStaff] = useState('');

  const [dataUserNo, setDataUserNo] = useState()
  const [userNo, setUserNo] = useState()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleCloseCheckBill = () => setShowConfirm(false);
  const handleShowCheckBill = () => setShowConfirm(true);
  
  const handleCloseUserNO = () => setShowConfirmUserNO(false);
  const handleShowUserNO = () => setShowConfirmUserNO(true);

  const [updateBill] = useMutation(CHECK_BILL)
  const [createOrderBill] = useMutation(CREATE_ORDER_BILL)
  const [deleteOrderBill] = useMutation(DELETE_ORDER_BILL)
  const [deleteBill] = useMutation(DELETE_BILL)
  const [loadDataCategories, { data: apolloDataCategories }] = useLazyQuery(GET_CATEGORY_SERVICES, { fetchPolicy: "network-only" });
  const [loadDataBill, { data: apolloDataBill }] = useLazyQuery(GET_BILL, { fetchPolicy: "network-only" });
  const [loadDataOrderBill, { data: apolloDataOrderBill }] = useLazyQuery(GET_ORDER_BILLS, { fetchPolicy: "network-only" });
  const [loadDataServices, { data: apolloDataServices }] = useLazyQuery(GET_SERVICES, { fetchPolicy: "network-only" });
  const [loadDataUsers, { data: apolloDaaUsers }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });
  const [getPromotions, { data: apolloDataPromotion }] = useLazyQuery(GET_PROMOTION_LIST, { fetchPolicy: "network-only" });
  const [loadDataDuty, { data: apolloDataDuty }] = useLazyQuery(GET_DUTYS, { fetchPolicy: "network-only" });
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
    getDataFromLocal();

    loadDataCategories();
    loadDataBill({ variables: { where: { id: billId } } });
    loadDataOrderBill({ variables: { where: { billId: billId } } });
    loadDataUsers({ variables: { where: { role: "STAFF" } } })
    getPromotions()
    loadDataDuty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    loadDataOrderBill({ variables: { where: { billId: billId } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId])

  useEffect(() => {
    if (apolloDataCategories) setCategoriesData(apolloDataCategories?.categoryServices?.data)
    if (apolloDaaUsers) { setUsersData(apolloDaaUsers?.users?.data); }
  }, [apolloDataCategories, apolloDaaUsers]);

  useEffect(() => {
    if(apolloDataUserNo) setDataUserNo(apolloDataUserNo?.user?.userNo)
  }, [apolloDataUserNo]);

  useEffect(() => {
    if (apolloDataServices) {
      setDataServices((e) => apolloDataServices?.services?.data?.map((x) => {
        let isActive = false;
        for (let i = 0; i < dataSelect.length; i++) {
          if (dataSelect[i].id === x.id) {
            isActive = true;
          }
        }
        return { ...x, isActive };
      }));
    }

    if (apolloDataOrderBill || apolloDataDuty) {
      setDataOrderBills(apolloDataOrderBill?.OrderBills?.data)
      setDataServices((e) => apolloDataServices?.services?.data?.map((x) => {
        let isActive = false;
        for (let i = 0; i < apolloDataOrderBill?.OrderBills?.data.length; i++) {
          if (apolloDataOrderBill?.OrderBills?.data[i].serviceId.id === x.id) {
            isActive = true;
          }
        }
        return { ...x, isActive };
      }));
      setFinalAmountOrderBills(apolloDataOrderBill?.OrderBills?.finalAmount)

      if (apolloDataDuty && apolloDataDuty?.duties?.data?.length > 0) {
        let amountDuty = apolloDataOrderBill?.OrderBills?.finalAmount * apolloDataDuty?.duties?.data[0]?.amount / 100
        setDuty(apolloDataDuty?.duties?.data[0]?.amount)
        setDutyMoney(amountDuty)
        setAmountWithDuty(apolloDataOrderBill?.OrderBills?.finalAmount + amountDuty)
        setFinalAmount(apolloDataOrderBill?.OrderBills?.finalAmount + amountDuty)
      } else {
        setDuty(0)
        setDutyMoney(0)
        setAmountWithDuty(0)
        setFinalAmount(apolloDataOrderBill?.OrderBills?.finalAmount)
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloDataServices, apolloDataOrderBill, apolloDataDuty])

  useEffect(() => {
    if (apolloDataBill) {
      setDataBill(apolloDataBill?.bill)
      setUsersData1(apolloDataBill?.bill?.customer?.id)
    }
    console.log('apolloDataBill: ', apolloDataBill?.bill?.customer?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloDataBill])

  useEffect(() => {
    if (apolloDataPromotion) setDataPromotion(apolloDataPromotion?.promotions?.data)
  }, [apolloDataPromotion])

  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true)
      let _where = {}
      if (cateGoryId !== "") _where = { ..._where, serviceCategoryId: cateGoryId ?? "" };
      await loadDataServices({
        variables: {
          where: _where,
        }
      });
      setIsLoading(false)
    }
    fetchServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cateGoryId])

  useEffect(() => {
    setFinalAmount(amountWithDuty + discount - parseInt(moneyDiscount))
  }, [discount, moneyDiscount, amountWithDuty])

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
      if(paymentMethod === "CASH_AND_ONLINE") {
        if(!customerPayMoneyCash || !customerPayMoneyOnline) {
          customizeToast("warning", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!")
          return;
        }
        if(parseInt(customerPayMoneyCash) + parseInt(customerPayMoneyOnline) < parseInt(finalAmount)) {
          customizeToast("warning", "ເງິນທີ່ລູກຄ້າຈ່າຍຍັງບໍ່ຄົບຕາມຈຳນວນເງິນທັງໝົດທີ່ຕ້ອງຊຳລະ!")
          return;
        }
      }else {
        if(!customerPayMoney)  {
          customizeToast("warning", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!")
          return;
        }
        if(parseInt(customerPayMoney) < parseInt(finalAmount))  {
          customizeToast("warning", "ເງິນທີ່ລູກຄ້າຈ່າຍຍັງບໍ່ຄົບຕາມຈຳນວນເງິນທັງໝົດທີ່ຕ້ອງຊຳລະ!")
          return;
        }
      }

      let _newData = {}
      if(paymentMethod === "CASH_AND_ONLINE") {
        _newData = {
          status: "CHECK_OUT",
          discount: parseInt(moneyDiscount),
          paymentMethod: paymentMethod,
          promotionId: promotionId,
          promotionAmount: discount,
          dutyAmount: dutyMoney,
          amountCash: customerPayMoneyCash,
          amountOnline: customerPayMoneyOnline,
          tipCash: tipCash,
          tipOnline: tipOnline,
        }
      }else {
        _newData = {
          status: "CHECK_OUT",
          discount: parseInt(moneyDiscount),
          paymentMethod: paymentMethod,
          promotionId: promotionId,
          promotionAmount: discount,
          dutyAmount: dutyMoney,
          tipCash: tipCash,
          tipOnline: tipOnline,
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
      }
      history.push(Routs.OPEN_BILL)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const _selectService = async (service) => {
    if (staff === "") return;
    setDataServices((e) => e?.map((data) => {
      if (data.id === service?.id) {
        return { ...data, isActive: true }
      } else {
        return data;
      }
    }))
    try {
      await createOrderBill({
        variables: {
          data: {
            serviceId: service?.id,
            billId: billId,
            staff: staff,
            customer: usersData1
          }
        }
      })

    } catch (err) {
      console.log('err: ', err);
    }
    loadDataOrderBill({ variables: { where: { billId: billId } } });
    setDataSelect((e) => [...e, { ...service, staff: staff }])
    setStaff('');

  }

  const _confirmDeleteBill = async () => {
    try {
      const cancelBill = await deleteBill({ variables: { where: { id: billId } } });
      if (cancelBill?.data?.deleteBill?.id) {
        customizeToast("success", "ຍົກເລີກບິນສຳເລັດ")
        history.push(Routs.OPEN_BILL)
      }
    } catch (error) {
      console.log(error)
      customizeToast("error", "ຍົກເລີກບິນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
    setShow(false);
  }

  const _deleteServiceId = async (id) => {
    try {
      const response = await deleteOrderBill({
        variables: { where: { id: id } }
      });
      if (response?.data?.deleteOrderBill) loadDataOrderBill({ variables: { where: { billId: billId } } });
    } catch (error) {
      console.log('error: ', error);
    }
    setDataSelect((e) => e?.filter((data) => {
      if (data.id === id) {
        return false;
      } else {
        return true;
      }
    }));

    setDataServices((e) => e?.map((data) => {
      if (data.id === id) {
        return { ...data, isActive: false }
      } else {
        return data;
      }
    }))
    // dataSelect
  }
  const _confirmSelectStaff = () => {
    _selectService(dataSelect1);
    handleClose();
  }

  const handleChangePromotion = e => {
    setPromotionId(e.target.value)
    if (e.target.value) {
      const _index = _.findIndex(dataPromotion, { id: e.target.value })
      setDiscount(dataPromotion[_index]?.discount)
    } else {
      setDiscount(0)
    }
  }

  const _onSelectNormalSalary = (value) => {
    setNormalSalary(value)
    let _normalSalary = parseInt(value !== "" ? value.toString().replaceAll(",", "") : "0");
    setMoneyDiscount(_normalSalary)
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

  return (
    <div>
      <Row>
        <Col md='8'>
          <div className='category-card'>
            <h4 className="text-primary mb-5"><b>{`ລູກຄ້າ: ${dataBill?.customer?.fullName} (${dataBill?.numberTable})`} </b></h4>
            <h3>ປະເພດ ບໍລິການ</h3>
            <div className='category-body'>
              <div className='category-list'>
                {categoryData?.map((ctg, idx) =>
                  <div className={ctg?.id === cateGoryId ? 'ctg-active' : 'category-item'} key={idx} onClick={() => setCateGoryId(ctg?.id)}>
                    <img src={
                      ctg?.image === null ? "https://www.pngall.com/wp-content/uploads/8/Service-Gear-PNG-Free-Download.png" : consts.URL_FOR_SHOW_PHOTO + ctg?.image } style={{ width: "100%", height: 70, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} alt='' />
                    <div style={{ textAlign: "center", marginTop: 5, paddingLeft: 8, paddingRight: 8 }}>
                      <h6>{ctg?.name}</h6>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='select-menu'>
            <h3>ຍອດນິຍົມ</h3>
            {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
              <div className='category-list'>
                {dataServices?.filter(data => data?.popular === "POPULAR")?.map((service, idx) =>
                  <div className={service?.isActive === true ? 'card-sell-active' : 'card-sell'}
                    key={idx} onClick={() => {
                      if (service?.isActive === true) return;
                      setDataSelect1(service)
                      handleShow()
                    }}>
                    <i></i>
                    <div style={{ color: "#fff", marginTop: 20, zIndex: 2, position: "absolute", fontWeight: 300 }}>
                      {currency(service?.amount)} ກີບ
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      textAlign: 'center', fontSize: 18, justifyItems: 'center', width: 'auto', height: '100%', paddingTop: 35
                    }}>
                      {service?.name}
                    </div>
                  </div>
                )}
              </div>
            }
            <hr />
            <h3>ເລືອກລາຍການ</h3>
            {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
              <div className='category-list'>
                {dataServices?.map((service, idx) =>
                  <div className={service?.isActive === true ? 'card-sell-active' : 'card-sell'}
                    key={idx} onClick={() => {
                      if (service?.isActive === true) return;
                      setDataSelect1(service)
                      handleShow()
                    }}>
                    <i></i>
                    <div style={{ color: "#FFFF", marginTop: 20, zIndex: 2, position: "absolute", fontWeight: 300 }}>
                      {currency(service?.amount)} ກີບ
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      textAlign: 'center', fontSize: 18, justifyItems: 'center', width: 'auto', height: '100%', paddingTop: 35
                    }}>
                      {service?.name}
                    </div>
                  </div>
                )}
              </div>
            }
          </div>
        </Col>

        <Col md='4'>
          <div className='category-card'>
            <div style={{ marginTop: 20 }}>
              <Form.Group>
                <Form.Label>ໂປຣໂມຊັ່ນ</Form.Label>
                <Form.Select as="select" placeholder="ກະລຸນາເພີ່ມ" name="promotionId" onChange={handleChangePromotion} >
                  <option value="">ບໍ່ມີ</option>
                  {dataPromotion?.map((item, index) => {
                    let stDate = moment(item?.startDate).diff(moment(), "day")
                    let eDate = moment(item?.endDate).diff(moment(), "day")
                    return <option style={{ display: (stDate <= 0 && eDate > 0) ? 'block' : 'none' }} key={index} value={item?.id}>{item?.code} ({currency(item?.discount)} {item?.typePromotion === "MONEY" ? "ກີບ" : "%"})</option>
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
                  thousandSeparator={true}
                />
              </Form.Group>
              <Card style={{ marginTop: 30, padding: 20 }}>
                <div style={{ fontWeight: 700 }}>ລາຍການບໍລິການ</div>
                <Table>
                  <tr>
                    <th style={{ width: 50 }}>ລ/ດ</th>
                    <th>ຊື່ບໍລິການ</th>
                    <th>ລາຄາ</th>
                    <th>ຈັດການ</th>
                  </tr>
                  {dataOrderBills?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data?.serviceId?.name}</td>
                        <td>{currency(data?.serviceId?.amount)} ກີບ</td>
                        <td><FontAwesomeIcon icon={faTrash} onClick={() => _deleteServiceId(data?.id)} className='icon-sell' /></td>
                      </tr>
                    )
                  })}
                </Table>
                <hr />
                <Row>
                  <Col md={7} style={{ textAlign: 'start' }} colSpan={2}>ລາຄາລວມ:</Col>
                  <Col md={5} style={{ textAlign: 'end' }}> {currency(finalAmountOrderBills)} ກີບ</Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: 'start' }} colSpan={2}>ໂປຣໂມຊັ່ນ:</Col>
                  <Col md={5} className="text-success" style={{ textAlign: 'end' }}>+ {currency(discount)} ກີບ</Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: 'start' }} colSpan={2}>ອ.ມ.ພ {duty} %:</Col>
                  <Col md={5} className="text-success" style={{ textAlign: 'end' }}>+ {currency(dutyMoney)} ກີບ</Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: 'start' }} colSpan={2}>ເງິນສ່ວນຫຼຸດ:</Col>
                  <Col md={5} className="text-danger" style={{ textAlign: 'end' }}>- {currency(parseInt(moneyDiscount))} ກີບ</Col>
                </Row>
                <Row>
                  <Col md={7} style={{ textAlign: 'start', fontWeight: 700 }} colSpan={2}>ເງິນທີ່ຕ້ອງຈ່າຍ:</Col>
                  <Col md={5} style={{ textAlign: 'end', fontWeight: 700 }}> {currency(finalAmount)} ກີບ</Col>
                </Row>
              </Card>
            </div>
            <div className="card-add-bottom">
              <button className="btn-cancel-web" onClick={() => setIsShowDelete(true)}>ຍົກເລີກບໍລິການ</button>
              <button className="btn-confirm-web" disabled={dataOrderBills?.length > 0 ? false : true} onClick={handleShowUserNO}>ເຊັກບິນ</button>
            </div>
          </div>

        </Col>
      </Row>
      <PrintBill
        data={dataOrderBills}
        amount={finalAmountOrderBills}
        finalAmount={finalAmount}
        duty={duty}
        dutyMoney={dutyMoney}
        allDiscount={moneyDiscount}
        promotion={discount}
      />

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>ເລືອກຊ່າງ ເພື່ອໃຫ້ບໍລິການ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>ຊ່າງ<span className="text-danger">*</span></Form.Label>
            <Form.Select as="select" placeholder="ກະລຸນາເພີ່ມ" name="firstName" onChange={(e) => setStaff(e.target.value)} >
              <option value="">ກາະລຸນາເລືອກຊ່າງ</option>
              {usersData?.map((user, index) =>
                <option key={index} value={user?.id}>{user?.fullName}</option>
              )}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button variant="primary" onClick={() => _confirmSelectStaff()}>
            ຢືນຢັນ
          </Button>
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
                {customerPayMoneyCash === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
                {console.log(customerPayMoneyCash)}
                {console.log(customerPayMoneyOnline)}
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
                {customerPayMoneyOnline === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
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
                {customerPayMoney === 0 ? <p className='text-danger'>ກະລຸນາປ້ອນ</p> : ''}
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
          <Button className='bg-primary' onClick={() => _confirmDeleteBill()}>
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
  )
}
