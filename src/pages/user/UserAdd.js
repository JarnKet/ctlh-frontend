import React, { useRef, useState } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Formik } from 'formik';
import { Breadcrumb, Row, Col, Form } from 'react-bootstrap';
import { CREATE_USER } from "../../apollo/user/Mutation"
import UploadPhoto from "../../helper/UploadPhoto";
import 'react-toastify/dist/ReactToastify.css';
import { customizeToast } from '../../helper/toast';
import { convertErrorMessage, convertFunctionName } from '../../helper/index';
import Routs from "../../consts/router";
import { ADDRESS } from '../../consts/address';
import _ from 'lodash';
import { NumericFormat } from 'react-number-format';

export default function UserAdd() {
  const checkboxRef = useRef();
  const history = useHistory();
  const location = useLocation();
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
  
  const [createUser] = useMutation(CREATE_USER);
  /**
   * 
   * @Function
   * 
   */
  const onSubmitAddUser = async (newData) => {
    try {
      await createUser({
        variables: newData
      });
      customizeToast("success", "ເພີ່ມຂໍ້ມູນຜຸ້ໃຊ້ສຳເລັດ")
      if(location?.state?.role === 'staff') {
        history.push(Routs.USER_LIST +'/limit/30/skip/1')
      }else {
        history.push(Routs.CUSTOMER_LIST +'/limit/30/skip/1')
      }
    } catch (error) {
      customizeToast("warning", convertErrorMessage(error.message))
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

  const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();

  return (
    <>
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ຜູ້ໃຊ້ລະບົບ</Breadcrumb.Item>
          <Breadcrumb.Item href="#" active>ເພີ່ມຜູ້ໃຊ້</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-add">
        <h4><b>ເພີ່ມຜູ້ໃຊ້</b></h4>
        <hr />
        <div className="card-add-body">
          <Formik
            enableReinitialize
            initialValues={{
              fullName: "",
              gender: "MALE",
              birthday: "",
              province: "",
              district: "",
              village: "",
              phone: "",
              userNo: "",
              role: location?.state?.role === 'staff' ? "" : "CUSTOMER",
              salary: "",
              userId: "",
              detail: "",
              note: ""
            }}
            validate={(values) => {
              const errors = {};
              if(location?.state?.role === 'staff') {
                if (!values.userId) errors.userId = 'ກະລຸນາປ້ອນບັນຊີເຂົ້າສູ່ລະບົບ!'
                if (!values.password) errors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ!'
                if (!values.userNo) errors.userNo = 'ກະລຸນາປ້ອນລະຫັດປະຈຳໂຕກ່ອນ!'
              }else {
                delete values.userId
                delete values.password
                delete values.userNo
              }
              if (!values.fullName) errors.fullName = 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກ່ອນ! (ຕົວຢ່າງ: ບຸນມີ ຄຳປະສົງ)'
              if (!values.phone) errors.phone = 'ເບີໂທບໍ່ຄວນຕຳກວ່າ 10 ຕົວເລກ!, ເບີໂທບໍ່ຄວນຫຼາຍກວ່າ 11 ຕົວເລກ!, ກາລຸນາປ້ອນເບີກ່ອນ!'
              if (!values.role) errors.role = 'ກະລຸນາປ້ອນເລືອກຕຳແໜ່ງກ່ອນ!'
              if (values?.role !== 'CUSTOMER') {
                if (!values.salary) errors.salary = 'ກະລຸນາປ້ອນເງິນເດືອນກ່ອນ!'
              }
              return errors;
            }}
            onSubmit={(values) => {
              if(values?.role !== 'CUSTOMER') {
                if(selectFunction?.length === 0) return;
              }
              let _normalSalary = parseInt(values.salary !== "" ? values.salary.toString().replaceAll(",", "") : "0");
              let data = { 
                ...values, 
                image: namePhoto, 
                manageFuntion: selectFunction,
                salary: _normalSalary
              }
              if(values?.role === 'CUSTOMER') delete data.salary
              onSubmitAddUser({ data: data });
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
                      <Form.Label>ຊື່ ແລະ ນາມສະກຸນ<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="fullName" onChange={handleChange} isInvalid={!!errors.fullName} value={values.fullName} />
                      {errors.fullName ? (<div className="text-danger">{errors.fullName}</div>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ເພດ:<span className="text-danger mr-4">*</span></Form.Label>
                      <Form.Check type='radio' inline="true" label="ຊາຍ" id="MALE" name="gender" onChange={handleChange} defaultChecked={values.gender === "MALE"} value="MALE" />
                      <Form.Check type='radio' inline="true" label="ຍິງ" id="FEMALE" name="gender" onChange={handleChange} defaultChecked={values.gender === "FEMALE"} value="FEMALE" />
                      {errors.gender ? (<div className="text-danger">{errors.gender}</div>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ເບີໂທ<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" placeholder="20xxxxxxxx" name="phone" onChange={handleChange} isInvalid={!!errors.phone} value={values.phone} maxLength={10} pattern='[+-]?\d+(?:[.,]\d+)?' />
                      {errors.phone ? <div className="text-danger">{errors.phone}</div> : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ວັນເດືອນປີເກີດ</Form.Label>
                      <Form.Control type="date" placeholder="ກະລຸນາເພີ່ມ" name="birthday" onChange={handleChange} defaultValue={values.birthday} value={values.birthday} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ແຂວງ</Form.Label>
                      <Form.Select name='province' onChange={(e) => {handleChange(e); _selectProvince(e)}}>
                        <option value="">ກາລຸນາເລືອກ</option>
                        {ADDRESS.map((item, index) => (
                          <option key={index} value={item?.province_name}>{item?.province_name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ເມືອງ</Form.Label>
                      <Form.Select name='district' onChange={handleChange} >
                        <option value="">ກາລຸນາເລືອກ</option>
                        {ADDRESS[selectProvinceIndex]?.district_list.map((item, index) => (
                          <option key={index} value={item?.district}>{item?.district}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ບ້ານ</Form.Label>
                      <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="village" onChange={handleChange} value={values.village} />
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
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="password" onChange={handleChange} isInvalid={!!errors.password} value={values.password} />
                        {errors.password ? <div className="text-danger">{errors.password}</div> : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ຕຳແໜ່ງ<span className="text-danger">*</span></Form.Label>
                        <Form.Select name='role' onChange={(e) => {
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
                    <button className="btn-cancel-web" onClick={() =>history.goBack()}>ຍົກເລີກ</button>
                    <button className="btn-confirm-web" onClick={handleSubmit}>ບັນທືກ</button>
                  </div>
                </Col>
              </Row>
            )}
          </Formik>

        </div>
      </div>

    </>
  )
}
