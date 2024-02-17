import React, { useEffect, useState } from 'react'

import { useLazyQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal, Button, Row, Col } from 'react-bootstrap';

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Routs from "../../consts/router";

import { OPEN_BILL } from "../../apollo/bill/Mutation"
import { GET_BILLS } from "../../apollo/bill/Query"
import { customizeToast } from '../../helper/toast';
import { CREATE_USER } from '../../apollo/user/Mutation';
import { GET_USERS } from '../../apollo/user/Query';
import { GET_CATEGORY_SERVICES, GET_SERVICES } from '../../apollo/service/Query';

export default function OpenBill() {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showOpenCourse, setShowOpenCourse] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [errorQty, setErrorQty] = useState('');
  const [dataBills, setDataBills] = useState([]);
  const [fullName, setFullName] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [phone, setPhone] = useState('')
  const [dataCustomerTotal, setDataCustomerTotal] = useState(0)
  const [serviceCategoryId, setServiceCategoryId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [dataService, setDataService] = useState([])
  const [qty, setQty] = useState('')

  const [createBill] = useMutation(OPEN_BILL);
  const [createUser] = useMutation(CREATE_USER);
  const [loadBills, { data: apolloBills }] = useLazyQuery(GET_BILLS, { fetchPolicy: "network-only" });
  const [loadDataUsers, { data: apolloDataUsers }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });
  const [loadDataCategory, { data: apolloDataCatgory }] = useLazyQuery(GET_CATEGORY_SERVICES, { fetchPolicy: "network-only" });
  const [loadDataServices, { data: apolloDataServices }] = useLazyQuery(GET_SERVICES, { fetchPolicy: "network-only" });

  useEffect(() => {
    loadBills({
      variables: {
        where: {
          status: "WAITING"
        }
      }
    });
    loadDataCategory({
      variables: {
        where: { isCourse: true }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setDataBills(apolloBills?.bills?.data)
  }, [apolloBills])

  useEffect(() => {
    if (phone) {
      loadDataUsers({
        variables: {
          where: { role: "CUSTOMER", phone: phone }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone])

  useEffect(() => {
    if (apolloDataUsers) {
      setCustomerId(apolloDataUsers?.users?.data?.[0]?.id)
      setFullName(apolloDataUsers?.users?.data?.[0]?.fullName)
      setDataCustomerTotal(apolloDataUsers?.users?.total)
    } else {
      setCustomerId('')
      setFullName('')
      setDataCustomerTotal(0)
    }
  }, [apolloDataUsers])

  useEffect(() => {
    if (fullName !== "") {
      loadBills({
        variables: {
          where: {
            customerFullName: fullName,
            status: "WAITING"
          }
        }
      });
    } else {
      loadBills({
        variables: {
          where: {
            status: "WAITING"
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName])

  useEffect(() => {
    setDataService([])
    if(serviceCategoryId !== "") {
      loadDataServices({
        variables: {
          where: {
            serviceCategoryId: serviceCategoryId
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceCategoryId]);

  useEffect(() => {
    if(apolloDataServices) setDataService(apolloDataServices?.services?.data)
  }, [apolloDataServices]);

  const _confirmCreateBill = async (showDisplay) => {
    console.log('showDisplay: ', showDisplay);
    try {
      if (dataCustomerTotal > 0) {
        // if (billNumber === '') {
        //   setErrorBillNumber("ກະລຸນາເພີ່ມ")
        //   return;
        // }
        const response = await createBill({
          variables: { data: { 
            numberTable: "billNumber", 
            customer: customerId,
            customerFullName: fullName, 
            isCheck: showDisplay
          } }
        });
        if (response?.data?.createBill) {
          loadBills();
          history.push(Routs.OPEN_BILL + Routs.SELL_PAGE + "/" + response?.data?.createBill?.id)
          customizeToast("success", "ເປິດບິນສຳເລັດສຳເລັດ")
        }
      } else {
        const createNewMember = await createUser({
          variables: {
            data: {
              fullName: fullName,
              phone: phone,
              role: "CUSTOMER"
            }
          }
        });

        if (createNewMember?.data?.createUser?.id) {
          // if (billNumber === '') {
          //   setErrorBillNumber("ກະລຸນາເພີ່ມ")
          //   return;
          // }
          const response = await createBill({
            variables: { data: { 
              numberTable: "billNumber", 
              customer: createNewMember?.data?.createUser?.id, 
              customerFullName: createNewMember?.data?.createUser?.fullName,
              isCheck: showDisplay,

            } }
          });
          if (response?.data?.createBill) {
            loadBills();
            history.push(Routs.OPEN_BILL + Routs.SELL_PAGE + "/" + response?.data?.createBill?.id)
            customizeToast("success", "ເປິດບິນສຳເລັດສຳເລັດ")
          }
        } else {
          customizeToast("error", "ເປິດບິນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
        }
      }
    } catch (error) {
      customizeToast("error", "ເປິດບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
  }

  const _confirmCreateBillCourse = async (showDisplay) => {
    try {
      if (dataCustomerTotal > 0) {
        // if (billNumber === '') {
        //   setErrorBillNumber("ກະລຸນາເພີ່ມ")
        //   return;
        // }
        if (qty === '') {
          setErrorQty("ກະລຸນາເພີ່ມ")
          return;
        }

        const response = await createBill({
          variables: { data: { 
            numberTable: "billNumber", 
            customer: customerId, 
            customerFullName: fullName,
            isCheck: showDisplay,
            serviceId: serviceId,
            courseAmount: parseInt(qty),
          } }
        });
        if (response?.data?.createBill) {
          loadBills();
          history.push(Routs.SELL_COURSE + "/" + response?.data?.createBill?.id)
          customizeToast("success", "ເປິດບິນສຳເລັດສຳເລັດ")
        }
      } else {
        const createNewMember = await createUser({
          variables: {
            data: {
              fullName: fullName,
              phone: phone,
              role: "CUSTOMER"
            }
          }
        });

        if (createNewMember?.data?.createUser?.id) {
          // if (billNumber === '') {
          //   setErrorBillNumber("ກະລຸນາເພີ່ມ")
          //   return;
          // }
          if (qty === '') {
            setErrorQty("ກະລຸນາເພີ່ມ")
            return;
          }
          const response = await createBill({
            variables: { data: { 
              numberTable: "billNumber", 
              customer: createNewMember?.data?.createUser?.id, 
              customerFullName: createNewMember?.data?.createUser?.fullName,
              isCheck: showDisplay,
              serviceId: serviceId,
              courseAmount: parseInt(qty),
            } }
          });
          if (response?.data?.createBill) {
            loadBills();
            history.push(Routs.SELL_COURSE + "/" + response?.data?.createBill?.id)
            customizeToast("success", "ເປິດບິນສຳເລັດສຳເລັດ")
          }
        } else {
          customizeToast("error", "ເປິດບິນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
        }
      }
    } catch (error) {
      customizeToast("error", "ເປິດບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseOpenCourse = () => setShowOpenCourse(false);
  const handleShowOpenCourse = () => setShowOpenCourse(true);
  const _generalCustomer = () => setShowDisplay(false);
  const _customerMember = () => setShowDisplay(true);
  const handleChangeCategory = (e) => {
    setServiceCategoryId(e.target.value)
    setServiceId('')
  }

  return (
    <div className='card-add mt-5'>
      <Row>
        <Col md='6'>
          <Form.Group className="mb-3">
            <Form.Label>ຄົ້ນຫາລູກຄ້າ</Form.Label>
            <Form.Control type="type" placeholder="ຄົ້ນຫາລູກຄ້າສະມາຊິກ" onChange={(e) => { setFullName(e.target.value) }} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md='12' style={{ marginTop: 20 }}>
          <button className="btn-confirm-web-outline" onClick={() => handleShow()}>
            <FontAwesomeIcon icon={faPlus} /> ເປີດບິນ
          </button>
          <button className="btn-confirm-web" onClick={() => handleShowOpenCourse()}>
            <FontAwesomeIcon icon={faPlus} /> ເປີດບິນສຳລັບຄອສໄລຍະຍາວ
          </button>
        </Col>
        <hr />
      </Row>

      {/* <div className='list-table'> */}
      <Row>
        {dataBills?.map((item, inx) => {
          return (
            <Col style={{ width: 143 }} md={2} key={inx}>
              <div 
                className={item?.courseAmount > 0 ? 'bill-list-course' : 'bill-list'}
                onClick={() => 
                  item?.courseAmount > 0
                  ? history.push(Routs.SELL_COURSE + "/" + item?.id)
                  : history.push(Routs.OPEN_BILL + Routs.SELL_PAGE + "/" + item?.id)
                }
              >
                <div style={{ fontSize: 28, textAlign: 'center', borderBottom: "solid 1px #ced4da" }}>{item?.numberTable}</div>
                {item?.courseAmount > 0
                  ? <div style={{ fontSize: 14 }}>ຄອສໄລຍະຍາວ</div>
                  : ''
                }
                
                <div style={{ fontSize: 14 }}>ຊື່: {item?.customer?.fullName}</div>
                <div style={{ fontSize: 14 }}>ເບີ: {item?.customer?.phone}</div>
                {/* <div style={{marginLeft: 8}}>ລູກຄ້າ: ທົ່ວໄປ</div> */}
              </div>
            </Col>
          )
        })}
      </Row>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>ຢືນຢັນເປິດບິນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className='switch-customer' >
            <div className={showDisplay === false ? "gn-cus active-cus" : "gn-cus border"} onClick={()=> _generalCustomer()}>ລູກຄ້າທົ່ວໄປ</div>
            <div className={showDisplay === true ? "cus-member active-cus" : "cus-member border"} onClick={()=> _customerMember()}>ລູກຄ້າຊະມາຊິກ</div>
          </div>
          {/* <div style={{display: showDisplay === false ? "block" : "none"}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ລະຫັດບິນ</Form.Label>
              <Form.Control type="text" placeholder="ປ້ອນລະຫັດບິນ" onChange={(e) => setBillNumber(e.target.value)} />
            </Form.Group>
            {errorBillNumber !== "" ? <div className="text-danger">{errorBillNumber}</div> : ""}
          </div> */}
          <div  style={{display: showDisplay === true ? "block" : "none"}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ຄົ້ນຫາເບີໂທລູກຄ້າ</Form.Label>
              <Form.Control type="text" maxLength={10} placeholder="20xxxxxxxx" onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>
            {(phone !== "" && phone.length === 10 && dataCustomerTotal < 1) ? <div className="text-danger">ບໍ່ມີລູກຄ້ານີ້</div> : ""}
            <div style={{ borderBottom: '3px solid #CCC' }} />

            {dataCustomerTotal > 0 ?
              <Form.Group className="mb-3 mt-4" controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ລູກຄ້າ</Form.Label>
                <Form.Control type="hidden" value={customerId ? customerId : ""} />
                <Form.Control type="text" disabled value={fullName ? fullName : ""} />
              </Form.Group>
              :
              <Form.Group className="mb-3 mt-4">
                <Form.Label>ຊື່ລູກຄ້າໃໝ່</Form.Label>
                <Form.Control type="text" disabled={phone.length === 10 ? false : true} onChange={(e) => setFullName(e.target.value)} value={fullName} />
              </Form.Group>
            }
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ລະຫັດບິນ</Form.Label>
              <Form.Control type="text" disabled={phone.length === 10 ? false : true} placeholder="ປ້ອນລະຫັດບິນ" onChange={(e) => setBillNumber(e.target.value)} />
            </Form.Group> */}
            {/* {errorBillNumber !== "" ? <div className="text-danger">{errorBillNumber}</div> : ""} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button className="btn btn-primary" onClick={() => _confirmCreateBill(showDisplay)}>
            {(phone !== "" && phone.length === 10 && dataCustomerTotal < 1) ? "ເພີ່ມລູກຄ້າໃໝ່ ແລະ ເປີດບິນ" : "ຢືນຢັນ"}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showOpenCourse} onHide={handleCloseOpenCourse} centered>
        <Modal.Header>
          <Modal.Title>ຢືນຢັນເປິດບິນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className='switch-customer' >
            <div className={showDisplay === false ? "gn-cus active-cus" : "gn-cus border"} onClick={()=> _generalCustomer()}>ລູກຄ້າທົ່ວໄປ</div>
            <div className={showDisplay === true ? "cus-member active-cus" : "cus-member border"} onClick={()=> _customerMember()}>ລູກຄ້າຊະມາຊິກ</div>
          </div>
          {/* <div style={{display: showDisplay === false ? "block" : "none"}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ລະຫັດບິນ<span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" placeholder="ປ້ອນລະຫັດບິນ" onChange={(e) => setBillNumber(e.target.value)} />
            </Form.Group>
            {errorBillNumber !== "" ? <div className="text-danger">{errorBillNumber}</div> : ""}
          </div> */}
          <div  style={{display: showDisplay === true ? "block" : "none"}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ຄົ້ນຫາເບີໂທລູກຄ້າ</Form.Label>
              <Form.Control type="text" maxLength={10} placeholder="20xxxxxxxx" onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>
            {(phone !== "" && phone.length === 10 && dataCustomerTotal < 1) ? <div className="text-danger">ບໍ່ມີລູກຄ້ານີ້</div> : ""}
            <div style={{ borderBottom: '3px solid #CCC' }} />

            {dataCustomerTotal > 0 ?
              <Form.Group className="mb-3 mt-4" controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ລູກຄ້າ</Form.Label>
                <Form.Control type="hidden" value={customerId ? customerId : ""} />
                <Form.Control type="text" disabled value={fullName ? fullName : ""} />
              </Form.Group>
              :
              <Form.Group className="mb-3 mt-4">
                <Form.Label>ຊື່ລູກຄ້າໃໝ່</Form.Label>
                <Form.Control type="text" disabled={phone.length === 10 ? false : true} onChange={(e) => setFullName(e.target.value)} value={fullName} />
              </Form.Group>
            }
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ລະຫັດບິນ</Form.Label>
              <Form.Control type="text" disabled={phone.length === 10 ? false : true} placeholder="ປ້ອນລະຫັດບິນ" onChange={(e) => setBillNumber(e.target.value)} />
            </Form.Group> */}
            {/* {errorBillNumber !== "" ? <div className="text-danger">{errorBillNumber}</div> : ""} */}
          </div>
          <Form.Group className="mb-3">
            <Form.Label>
              ປະເພດບໍລິການ<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="serviceCategoryId"
              onChange={(e) => handleChangeCategory(e)}
            >
              <option value="">ກາລຸນາເລືອກ</option>
              {apolloDataCatgory && apolloDataCatgory?.categoryServices?.data?.map(
                (item, index) => (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                )
              )}
            </Form.Select>
            {/* {errors.serviceCategoryId ? (
              <div className="text-danger">{errors.serviceCategoryId}</div>
            ) : null} */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              ບໍລິການ<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="serviceId"
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">ກາລຸນາເລືອກ</option>
              {dataService?.map(
                (item, index) => (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                )
              )}
            </Form.Select>
            {/* {errors.serviceId ? (
              <div className="text-danger">{errors.serviceId}</div>
            ) : null} */}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>ຈຳນວນຄັ້ງ<span className="text-danger">*</span></Form.Label>
            <Form.Control type="number" placeholder="ປ້ອນຈຳນວນຄັ້ງ" min={1} onChange={(e) => setQty(e.target.value)} />
            {errorQty !== "" ? <div className="text-danger">{errorQty}</div> : ""}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOpenCourse}>
            ຍົກເລີກ
          </Button>
          <Button className="btn btn-primary" onClick={() => _confirmCreateBillCourse(showDisplay)}>
            {(phone !== "" && phone.length === 10 && dataCustomerTotal < 1) ? "ເພີ່ມລູກຄ້າໃໝ່ ແລະ ເປີດບິນ" : "ຢືນຢັນ"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}