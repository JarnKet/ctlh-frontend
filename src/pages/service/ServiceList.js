import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

import { Formik } from 'formik';
import * as Yup from "yup";

import { Form, Col, Row, Breadcrumb, Table, Spinner, Modal, Button } from 'react-bootstrap';
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { customizeToast } from '../../helper/toast';
import { CREATE_SERVICE, DELETE_SERVICE, UPDATE_SERVICE } from '../../apollo/service/Mutation';
import { GET_CATEGORY_SERVICES, GET_SERVICES } from '../../apollo/service/Query';
import { convertErrorMessage, currency } from '../../helper';
import PaginationHelper from '../../helper/PaginationHelper';
import queryString from 'query-string';
import Route from '../../consts/router';

export default function ServiceList() {
  const location = useLocation();
  const parsed = queryString?.parse(location?.state);
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataServices, setDataServices] = useState([]);
  const [dataForEdit, setDataForEdit] = useState({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(parsed?.name ? parsed?.name : "");
  const [dataCategory, setDataCategory] = useState([])

  const handleClose = () => setShowAdd(false);
  const _handleShow = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const _handleShowEdit = () => setShowEdit(true);
  const _handleCloseDelete = () => setShowDelete(false);

  const [loadDataCategory, { data: apolloDataCatgory }] = useLazyQuery(GET_CATEGORY_SERVICES, { fetchPolicy: "network-only" });
  const [loadDataServices, { data: apolloDaaServices }] = useLazyQuery(GET_SERVICES, { fetchPolicy: "network-only" });
  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [deleteService] = useMutation(DELETE_SERVICE);

  useEffect(() => {
    fetchService();
    loadDataCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true)
      let _where = {}
      if (name !== "") _where = { ..._where, name: name ?? "" };
      await loadDataServices({
        variables: {
          where: _where,
          skip: (_skip - 1) * _limit,
          limit: _limit,
        }
      });
      setIsLoading(false)
    }
    fetchServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    if (apolloDaaServices) {
      setDataServices(apolloDaaServices?.services?.data);
      setTotal(apolloDaaServices?.services?.total)
    }
  }, [apolloDaaServices])
  
  useEffect(() => {
    if (apolloDataCatgory) {
      setDataCategory(apolloDataCatgory?.categoryServices?.data);
    }
  }, [apolloDataCatgory])

  const fetchService = async () => {
    try {
      setIsLoading(true)
      await loadDataServices({
        variables: {
          skip: (_skip - 1) * _limit,
          limit: _limit,
        }
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  /**
   * 
   * @Function
   * 
   */

  const _selectNameForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກຊື່ບໍລິການແລ້ວ")
    navigator.clipboard.writeText(code)
  }
  const _confirmDeleteUser = async () => {
    try {
      await deleteService({variables: {where: {id: dataForEdit?.id}}})
      fetchService();
      customizeToast("success", "ລຶບບໍລິການສຳເລັດ");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error) {
      customizeToast("error", "ລຶບບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!");
    }
    setShowDelete(false)
  }
  const SignupSchema = Yup.object().shape({
    serviceCategoryId: Yup.string().required('ກະລຸນາປ້ອນປະເພດບໍລິການກ່ອນ'),
    name: Yup.string().required('ກະລຸນາປ້ອນຊື່ບໍລິການກ່ອນ'),
    amount: Yup.string().required('ກະລຸນາປ້ອນລາຄາບໍລິການກ່ອນ')
  });

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ບໍລິການ</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title">
        <Form.Group className="mb-3">
          <Form.Label>ຄົ້ນຫາ</Form.Label>
          <Form.Control type="type" placeholder="ປ້ອນຊື່ບໍລິການ" onChange={(e) => { setName(e.target.value) }} defaultValue={name} />
        </Form.Group>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ບໍລິການ ({currency(total)})</b></h4>
          <button className="btn-primary-web"
            onClick={() => _handleShow()}
          >+ ເພີ່ມບໍລິການ</button>
        </div>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ປະເພດບໍລິການ</th>
                  <th>ຊື່ບໍລິການ</th>
                  <th>ລາຄາບໍລິການ</th>
                  <th>ລາຍລະອຽດ</th>
                  <th>ໝາຍເຫດ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              {dataServices?.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item?.serviceCategoryId?.name}</td>
                      <td>{item?.name}  <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectNameForCopy(e, item?.name)} /></td>
                      <td>{currency(item?.amount)}</td>
                      <td>{item?.detail}</td>
                      <td>{item?.note}</td>
                      <td>
                        <button className='btn-list-edit'
                          onClick={() => {
                            _handleShowEdit()
                            setDataForEdit(item)
                          }}
                        ><FontAwesomeIcon icon={faEdit} /></button>
                        <button className='btn-list-delete' onClick={() => {
                           setShowDelete(true)
                           setDataForEdit(item)
                        }}
                        ><FontAwesomeIcon icon={faTrash} /> </button>
                      </td>
                    </tr>
                  </tbody>
                )
              })}
            </Table>
          }
          {Pagination_helper(total, Route.SERVICE_LIST, `name=${name}`)}
        </div>
      </div>
      <Formik
      enableReinitialize
        initialValues={{
          serviceCategoryId: "",
          name: "",
          amount: "",
          detail: "",
          popular: "NO_POPULAR",
          note: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createService({
              variables: { data: { ...values } }
            });
            setShowAdd(false);
            fetchService();
            customizeToast("success", "ເພີ່ມບໍລິການສຳເລັດ");
            resetForm({ values: '' })
          } catch (error) {
            console.log('error: ', error);
            customizeToast("error", convertErrorMessage(error?.message));
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <Modal show={showAdd} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>ເພີ່ມບໍລິການ</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Row>
                <Col sm="12">
                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        ປະເພດບໍລິການ<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="serviceCategoryId"
                        onChange={handleChange}
                        isInvalid={!!errors.serviceCategoryId}
                      >
                        <option value="">ກາລຸນາເລືອກ</option>
                        {dataCategory.map(
                          (item, index) => (
                            <option key={index} value={item?.id}>
                              {item?.name}
                            </option>
                          )
                        )}
                      </Form.Select>
                      {errors.serviceCategoryId ? (
                        <div className="text-danger">{errors.serviceCategoryId}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ຊື່ບໍລິການ<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="name" onChange={handleChange} isInvalid={!!errors.name} value={values.name} />
                      {errors.name ? (<div className="text-danger">{errors.name}</div>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ລາຍການຍອດນິຍົມ:<span className="text-danger mr-4">*</span></Form.Label>
                      <Form.Check type='radio' inline="true" label="ແມ່ນ" id="POPULAR" name="popular" onChange={handleChange} defaultChecked={values.popular === "POPULAR"} value="POPULAR" />
                      <Form.Check type='radio' inline="true" label="ບໍ່ແມ່ນ" id="NO_POPULAR" name="popular" onChange={handleChange} defaultChecked={values.popular === "NO_POPULAR"} value="NO_POPULAR" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ລາຄາບໍລິການ<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="number" placeholder="ກະລຸນາເພີ່ມ" name="amount" onChange={handleChange} isInvalid={!!errors.amount} value={values.amount} />
                      {errors.amount ? (<div className="text-danger">{errors.amount}</div>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ລາຍລະອຽດ</Form.Label>
                      <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="detail" onChange={handleChange} value={values.detail} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ໝາຍເຫດ</Form.Label>
                      <Form.Control as="textarea" type="text" placeholder="ກະລຸນາເພີ່ມ" name="note" onChange={handleChange} value={values.note} />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ຍົກເລີກ
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                ເພີ່ມບໍລິການ
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
      {dataForEdit &&
        <Formik
          enableReinitialize
          initialValues={{
            serviceCategoryId: dataForEdit?.serviceCategoryId?.id,
            name: dataForEdit?.name,
            popular: dataForEdit?.popular,
            amount: dataForEdit?.amount,
            detail: dataForEdit?.detail,
            note: dataForEdit?.note,
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { resetForm }) => {
            if(values.name === dataForEdit?.name) delete values.name;
            try {
              await updateService({
                variables: { data: { ...values }, where: { id: dataForEdit?.id } }
              });
              setShowEdit(false);
              customizeToast("success", "ແກ້ໄຂບໍລິການສຳເລັດ");
              resetForm({ values: '' })
              fetchService()
            } catch (error) {
              console.log('error: ', error);
              customizeToast("error", convertErrorMessage(error?.message));
            }
          }}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <Modal show={showEdit} onHide={handleCloseEdit}>
              <Modal.Header closeButton>
                <Modal.Title><b>ແກ້ໄຂບໍລິການ</b></Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Row>
                  <Col sm="12">
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          ປະເພດບໍລິການ<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="serviceCategoryId"
                          onChange={handleChange}
                          value={values.serviceCategoryId}
                          isInvalid={!!errors.serviceCategoryId}
                        >
                          <option value="">ກາລຸນາເລືອກ</option>
                          {dataCategory.map(
                            (item, index) => (
                              <option key={index} value={item?.id}>
                                {item?.name}
                              </option>
                            )
                          )}
                        </Form.Select>
                        {errors.serviceCategoryId ? (
                          <div className="text-danger">{errors.serviceCategoryId}</div>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ຊື່ບໍລິການ<span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="name" onChange={handleChange} isInvalid={!!errors.name} value={values.name} />
                        {errors.name ? (<div className="text-danger">{errors.name}</div>) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                      <Form.Label>ລາຍການຍອດນິຍົມ:<span className="text-danger mr-4">*</span></Form.Label>
                      <Form.Check type='radio' inline="true" label="ແມ່ນ" id="POPULAR" name="popular" onChange={handleChange} defaultChecked={values.popular === "POPULAR"} value="POPULAR" />
                      <Form.Check type='radio' inline="true" label="ບໍ່ແມ່ນ" id="NO_POPULAR" name="popular" onChange={handleChange} defaultChecked={values.popular === "NO_POPULAR"} value="NO_POPULAR" />
                    </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ລາຄາບໍລິການ<span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" placeholder="ກະລຸນາເພີ່ມ" name="amount" onChange={handleChange} isInvalid={!!errors.amount} value={values.amount} />
                        {errors.amount ? (<div className="text-danger">{errors.amount}</div>) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ລາຍລະອຽດ</Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="detail" onChange={handleChange} value={values.detail} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ໝາຍເຫດ</Form.Label>
                        <Form.Control as="textarea" type="text" placeholder="ກະລຸນາເພີ່ມ" name="note" onChange={handleChange} value={values.note} />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  ຍົກເລີກ
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  ແກ້ໄຂ
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Formik>
      }

      <Modal show={showDelete} onHide={_handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title><b>ຢືນຢັນການລຶບ</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການລຶບບໍລິການນີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={_handleCloseDelete}>
            ຍົກເລີກ
          </Button>
          <Button variant="primary" onClick={() => _confirmDeleteUser()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
      {/* deleteService */}
    </div>
  )
}
