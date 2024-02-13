import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Formik } from 'formik';
import { Breadcrumb, Row, Col, Form, Spinner } from 'react-bootstrap';
import { UPDATE_USER } from "../../apollo/user/Mutation"
import { GET_USER } from '../../apollo/user/Query';
import UploadPhoto from "../../helper/UploadPhoto";
import 'react-toastify/dist/ReactToastify.css';
import { customizeToast } from '../../helper/toast';
import Routs from "../../consts/router";
import { ADDRESS } from '../../consts/address';
import _ from 'lodash';
import { NumericFormat } from 'react-number-format';
import { formatDateDash } from '../../common';
import { convertErrorMessage, convertFunctionName } from '../../helper';

export default function UserEdit() {
  const checkboxRef = useRef();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  /**
   * 
   * @State
   * 
   */
  const [dataUser, setDataUser] = useState()
  const [selectProvinceIndex, setSelectProvinceIndex] = useState()
  const [selectFunction, setSelectFunction] = useState([])
  let allFunction = ['DASHBOARD', 'BILL', 'PRODUCT', 'SERVICE', 'EXPENDITURE', 'USER', 'ENTRY_EXIT', 'ABSENT', 'PROMOTION', 'DUTY', 'CUSTOMER']

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectFunction([...selectFunction, value]);
    } else {
      setSelectFunction(selectFunction?.filter((role) => role !== value));
    }
  };
  
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
  const [loadDataUsers, { data: apolloDaaUsers, loading }] = useLazyQuery(GET_USER, {fetchPolicy: "network-only"});

  /**
   * 
   * @UseEffect
   * 
   */

  useEffect(() => {
    loadDataUsers({ variables: { where: { id: match?.params?.id } } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.params?.id])

  useEffect(() => {
    if (apolloDaaUsers)
    setDataUser(apolloDaaUsers?.user)
    setNamePhoto(apolloDaaUsers?.user?.image);
    setSelectFunction(apolloDaaUsers?.user?.manageFuntion)
    const _provinceIndex = _.findIndex(ADDRESS, {
      province_name: apolloDaaUsers?.user?.province,
    });
    setSelectProvinceIndex(_provinceIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloDaaUsers])


  /**
   * 
   * @Function
   * 
   */
  const onSubmitEditUser = async (newData) => {
    try {
      await updateUser({
        variables: {
          where: { id: match?.params?.id },
          data: newData?.data
        }
      });
      if(location?.state?.role === 'staff') {
        history.push(Routs.USER_LIST +'/limit/30/skip/1')
      }else {
        history.push(Routs.CUSTOMER_LIST +'/limit/30/skip/1')
      }
    } catch (error) {
      customizeToast("error",convertErrorMessage(error.message))
    }
  }

  const _selectProvince = (e) => {
    const _provinceIndex = _.findIndex(ADDRESS, {
      province_name: e.target.value,
    });
    setSelectProvinceIndex(_provinceIndex);
  };

  const onSelectFunction = (data) => {
    if(data === 'ADMIN') {
      setSelectFunction(allFunction)
    }else {
      setSelectFunction([])
    }
  }

  const { namePhoto, buttonUploadAndShowPhoto, setNamePhoto } = UploadPhoto();
  if (loading || updateLoading) return <div className='customLoading'> <Spinner animation="border" variant="primary" /> </div>
  return (
    <>
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ຜູ້ໃຊ້ລະບົບ</Breadcrumb.Item>
          <Breadcrumb.Item href="#" active>ແກ້ໄຂຜູ້ໃຊ້</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-add">
        <h4><b>ແກ້ໄຂຜູ້ໃຊ້</b></h4>
        <hr />
        <div className="card-add-body">
          {dataUser &&
            <Formik
              enableReinitialize
              initialValues={{
                fullName: dataUser?.fullName || "",
                phone: dataUser?.phone || "",
                role: dataUser?.role || "",
                salary: dataUser?.salary || "",
                userId: dataUser?.userId || "",
                note: dataUser?.note || "",
                gender: dataUser?.gender || "",
                birthday: dataUser?.birthday ? formatDateDash(dataUser?.birthday) : "",
                province: dataUser?.province || "",
                district: dataUser?.district || "",
                village: dataUser?.village || "",
                detail: dataUser?.detail || "",
                userNo: dataUser?.userNo || "",
              }}
              validate={(values) => {
                const errors = {};
                if(location?.state?.role === 'staff') {
                  if (!values.userId) errors.userId = 'ກະລຸນາປ້ອນບັນຊີເຂົ້າສູ່ລະບົບ!'
                  if (!values.userNo) errors.userNo = 'ກະລຸນາປ້ອນລະຫັດປະຈຳໂຕກ່ອນ!'
                }else {
                  delete values.userId
                  delete values.userNo
                }
                if (!values.fullName) errors.fullName = 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກ່ອນ! (ຕົວຢ່າງ: ບຸນມີ ຄຳປະສົງ)'
                if (!values.phone) errors.phone = 'ເບີໂທບໍ່ຄວນຕຳກວ່າ 10 ຕົວເລກ!, ເບີໂທບໍ່ຄວນຫຼາຍກວ່າ 11 ຕົວເລກ!, ກາລຸນາປ້ອນເບີກ່ອນ!'
                if (!values.role) errors.role = 'ກະລຸນາປ້ອນເລືອກຕຳແໜ່ງກ່ອນ!'
                if (!values.gender) errors.gender = 'ກະລຸນາເລືອກເພດກ່ອນ!'
                if (values?.role !== 'CUSTOMER') {
                  if (!values.salary) errors.salary = 'ກະລຸນາປ້ອນເງິນເດືອນກ່ອນ!'
                }
                return errors;
              }}
              onSubmit={(values) => {
                if(values?.role !== 'CUSTOMER') {
                  if(selectFunction?.length === 0) return;
                }
                if(values?.userId === dataUser?.userId) delete values?.userId;
                
                let _normalSalary = parseInt(values.salary !== "" ? values.salary.toString().replaceAll(",", "") : "0");
                let data = { 
                  ...values, 
                  image: namePhoto, 
                  manageFuntion: selectFunction,
                  salary: _normalSalary
                }
                console.log(data)
                if(values?.role === 'CUSTOMER') delete data.salary
                onSubmitEditUser({ data: data });
              }}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <Row>
                  <Col sm="3">
                    <h5><b>ອັບໂຫຼດຮູບພາບ</b></h5>
                    {buttonUploadAndShowPhoto()}
                  </Col>
                  <Col sm="9">
                    <div style={{ marginTop: 25 }}>

                      <Form.Group className="mb-3">
                        <Form.Label>ຊື່ ແລະ ນາມສະກຸນ</Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="fullName" onChange={handleChange} isInvalid={!!errors.fullName} value={values.fullName} />
                        {errors.fullName ? (<div className="text-danger">{errors.fullName}</div>) : null}
                      </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>ເພດ:<span className="text-danger mr-4">*</span></Form.Label>
                        <Form.Check type='radio' defaultChecked={values.gender === 'MALE' ? true : false} inline="true" label="ຊາຍ" id="MALE" name="gender" onChange={handleChange} isInvalid={!!errors.gender} value="MALE" />
                        <Form.Check type='radio' defaultChecked={values.gender === 'FEMALE' ? true : false} inline="true" label="ຍິງ" id="FEMALE" name="gender" onChange={handleChange} isInvalid={!!errors.gender} value="FEMALE" />
                        {errors.gender ? (<div className="text-danger">{errors.gender}</div>) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ວັນເດືອນປີເກີດ</Form.Label>
                        <Form.Control type="date" placeholder="ກະລຸນາເພີ່ມ" name="birthday" onChange={handleChange} isInvalid={!!errors.birthday} value={values.birthday} />
                        {errors.birthday ? (<div className="text-danger">{errors.birthday}</div>) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ແຂວງ</Form.Label>
                        <Form.Select name='province' onChange={(e) => {handleChange(e); _selectProvince(e);}} isInvalid={!!errors.province} value={values.province} >
                          <option value="">ກາລຸນາເລືອກ</option>
                          {ADDRESS.map((item, index) => (
                            <option key={index} value={item?.province_name}>{item?.province_name}</option>
                          ))}
                        </Form.Select>
                        {errors.province ? <div className="text-danger">{errors.province}</div> : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ເມືອງ</Form.Label>
                        <Form.Select name='district' onChange={handleChange} isInvalid={!!errors.district} value={values.district} >
                          <option value="">ກາລຸນາເລືອກ</option>
                          {ADDRESS[selectProvinceIndex]?.district_list.map((item, index) => (
                            <option key={index} value={item?.district}>{item?.district}</option>
                          ))}
                        </Form.Select>
                        {errors.district ? <div className="text-danger">{errors.district}</div> : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ບ້ານ</Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="village" onChange={handleChange} isInvalid={!!errors.village} value={values.village} />
                        {errors.village ? <div className="text-danger">{errors.village}</div> : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ເບີໂທ<span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="phone" onChange={handleChange} isInvalid={!!errors.phone} value={values.phone} maxLength={10} pattern='[+-]?\d+(?:[.,]\d+)?' />
                        {errors.phone ? <div className="text-danger">{errors.phone}</div> : null}
                      </Form.Group>
                      {location?.state?.role === 'staff' ?
                        <>
                        <Form.Group className="mb-3">
                          <Form.Label>ບັນຊີເຂົ້າສູ່ລະບົບ<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="userId" onChange={handleChange} isInvalid={!!errors.userId} value={values.userId} />
                          {errors.userId ? <div className="text-danger">{errors.userId}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>ລະຫັດ<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="password" onChange={handleChange} value={values.password} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>ຕຳແໜ່ງ<span className="text-danger">*</span></Form.Label>
                          <Form.Select value={values.role} name='role' onChange={(e) => {
                            handleChange(e);
                            onSelectFunction(e.target.value);
                          }} isInvalid={!!errors.role}  >
                            <option value="">ກາລຸນາເລືອກ</option>
                            <option value="ADMIN">ແອັດມິນ</option>
                            <option value="STAFF_STOCK">ພະນັກງານສາງ</option>
                            <option value="STAFF">ຊ່າງ</option>
                            <option value="COUNTER">ພະນັກງານເຄົ້າເຕີ້</option>
                            <option value="MANAGER_REPORT">ຜູ້ຕິດຕາມ</option>
                          </Form.Select>
                          {errors.role ? <div className="text-danger">{errors.role}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>ເງິນເດືອນ<span className="text-danger">*</span></Form.Label>
                          <NumericFormat
                            name="salary"
                            className="form-control"
                            onChange={handleChange}
                            value={values.salary}
                            placeholder="ປ້ອນເງິນເດືອນ"
                            thousandSeparator={true}
                          />
                          {errors.salary ? <div className="text-danger">{errors.salary}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>ລະຫັດປະຈຳໂຕ<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="userNo" onChange={handleChange} isInvalid={!!errors.userNo} value={values.userNo} />
                          {errors.userNo ? <div className="text-danger">{errors.userNo}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>ສິດການນຳໃຊ້<span className="text-danger">*</span></Form.Label>
                          <br />
                          <strong>ໜ້າຮ້ານ</strong>
                          <div className="create-role">
                            {allFunction?.map((item, index) => (
                              ['DASHBOARD', 'BILL', 'CUSTOMER'].includes(item) ? 
                              <label
                                className="create-role-box"
                                style={{
                                  border: selectFunction?.includes(item)
                                    ? "2px solid #2E72D2"
                                    : "0",
                                }}
                                key={"item" + index}
                                htmlFor={`checkbox${index}`}
                              >
                                <input
                                  type="checkbox"
                                  id={`checkbox${index}`}
                                  ref={checkboxRef}
                                  onChange={handleCheckboxChange}
                                  value={item}
                                  className="create-checkbox"
                                  name='manageFuntion'
                                  checked={selectFunction?.includes(item) ? true : false}
                                  disabled={values.role === 'ADMIN' ? true : false}
                                />
                                {convertFunctionName(item)}
                              </label>
                              : <></>
                            ))}
                          </div>
                          
                          <br />
                          <strong>ຫຼັງຮ້ານ</strong>
                          <div className="create-role">
                            {allFunction?.map((item, index) => (
                              ['PRODUCT', 'SERVICE', 'EXPENDITURE', 'USER', 'ENTRY_EXIT', 'ABSENT', 'PROMOTION', 'DUTY'].includes(item) ? 
                              <label
                                className="create-role-box"
                                style={{
                                  border: selectFunction?.includes(item)
                                    ? "2px solid #2E72D2"
                                    : "0",
                                }}
                                key={"item" + index}
                                htmlFor={`checkbox${index}`}
                              >
                                <input
                                  type="checkbox"
                                  id={`checkbox${index}`}
                                  ref={checkboxRef}
                                  onChange={handleCheckboxChange}
                                  value={item}
                                  className="create-checkbox"
                                  name='manageFuntion'
                                  checked={selectFunction?.includes(item) ? true : false}
                                  disabled={values.role === 'ADMIN' ? true : false}
                                />
                                {convertFunctionName(item)}
                              </label>
                              : <></>
                            ))}
                          </div>
                          {selectFunction?.length > 0 ? '' : <div className="text-danger">ກະລຸນາປ້ອນເລືອກສິດການນຳໃຊ້ກ່ອນ</div>}
                        </Form.Group>
                        </>
                        : <></>
                      }
                      <Form.Group className="mb-3">
                        <Form.Label>ໝາຍເຫດ</Form.Label>
                        <Form.Control as="textarea" type="text" placeholder="ກະລຸນາເພີ່ມ" name="note" onChange={handleChange} value={values.note} />
                      </Form.Group>
                    </div>
                    <div className="card-add-bottom">
                      <button className="btn-cancel-web" onClick={() => history.goBack()}>ຍົກເລີກ</button>
                      <button type='button' className="btn-confirm-web" onClick={handleSubmit}>ບັນທຶກ</button>
                    </div>
                  </Col>
                </Row>
              )}
            </Formik>
          }
        </div>
      </div>

    </>
  )
}
