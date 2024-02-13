import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Formik } from 'formik';
import * as Yup from "yup";

import { Form, Col, Row, Breadcrumb, Table, Spinner, Modal, Button } from 'react-bootstrap';
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "../../apollo/category/Mutation"
import { GET_CATEGORY } from "../../apollo/category/Query"
import { customizeToast } from '../../helper/toast';
import { convertErrorMessage } from '../../helper';
// import consts from '../../consts';

export default function Category() {
  // const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataCategories, setDataCategories] = useState([]);
  const [dataForEdit, setDataForEdit] = useState({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const handleClose = () => setShowAdd(false);
  const _handleShow = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const _handleShowEdit = () => setShowEdit(true);
  const _handleCloseDelete = () => setShowDelete(false);

  const [loadDataCategories, { data: apolloDaaCategories }] = useLazyQuery(GET_CATEGORY, { fetchPolicy: "network-only" });
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true)
      let _where = {}
      if (name !== "") _where = { ..._where, name: name ?? "" };
      await loadDataCategories({
        variables: {
          where: _where,
        }
      });
      setIsLoading(false)
    }
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    if (apolloDaaCategories) {
      setDataCategories(apolloDaaCategories?.categorys?.data);
      setTotal(apolloDaaCategories?.categorys?.total)
    }
  }, [apolloDaaCategories])

  const fetchCategory = async () => {
    try {
      setIsLoading(true)
      await loadDataCategories();
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
    customizeToast("success", "ຄັດລອກຊື່ປະເພດສິນຄ້າແລ້ວ")
    navigator.clipboard.writeText(code)
  }
  const _confirmDeleteUser = async () => {
    try {
      await deleteCategory({ variables: { where: { id: dataForEdit?.id } } })
      fetchCategory();
      customizeToast("success", "ລຶບປະເພດສິນຄ້າສຳເລັດ");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error) {
      customizeToast("error", "ລຶບບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!");
    }
    setShowDelete(false)
  }
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('ກະລຸນາປ້ອນຊື່ປະເພດສິນຄ້າກ່ອນ'),
  });

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ປະເພດສິນຄ້າ</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title">
        <Form.Group className="mb-3">
          <Form.Label>ຄົ້ນຫາ</Form.Label>
          <Form.Control type="type" placeholder="ປ້ອນລະຫັດປະເພດສິນຄ້າ" onChange={(e) => { setName(e.target.value) }} />
        </Form.Group>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ປະເພດສິນຄ້າ ({total})</b></h4>
          <button className="btn-primary-web"
            onClick={() => _handleShow()}
          >+ ເພີ່ມປະເພດສິນຄ້າ</button>
        </div>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  {/* <th>ຮູບພາບ</th> */}
                  <th>ຊື່ປະເພດສິນຄ້າ</th>
                  <th>ລາຍລະອຽດ</th>
                  <th>ໝາຍເຫດ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              {dataCategories?.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      {/* <td>
                        <img src={consts.URL_FOR_SHOW_PHOTO + item?.image} style={{ width: 50, height: 50 }} />
                      </td> */}
                      <td>{item?.name}  <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectNameForCopy(e, item?.name)} /></td>
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
        </div>
      </div>
      <Formik
        initialValues={{
          name: "",
          detail: "",
          note: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createCategory({
              variables: { data: { ...values } }
            });
            setShowAdd(false);
            fetchCategory();
            customizeToast("success", "ເພີ່ມປະເພດສິນຄ້າສຳເລັດ");
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
              <Modal.Title>ເພີ່ມປະເພດສິນຄ້າ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <Col sm="12">
                <h6>ອັບໂຫຼດຮູບພາບ <span className="text-danger">*</span></h6>
                {buttonUploadAndShowPhoto()}
              </Col> */}
              <Row>
                <Col sm="12">
                  <div>

                    <Form.Group className="mb-3">
                      <Form.Label>ຊື່ປະເພດສິນຄ້າ<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="name" onChange={handleChange} isInvalid={!!errors.name} value={values.name} />
                      {errors.name ? (<div className="text-danger">{errors.name}</div>) : null}
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
              <Button className="btn btn-primary" onClick={handleSubmit}>
                ເພີ່ມປະເພດ
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
      {dataForEdit &&
        <Formik
          enableReinitialize
          initialValues={{
            name: dataForEdit?.name,
            detail: dataForEdit?.detail,
            note: dataForEdit?.note,
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (values.name === dataForEdit?.name) delete values.name
              await updateCategory({
                variables: { data: { ...values }, where: { id: dataForEdit?.id } }
              });
              setShowEdit(false);
              customizeToast("success", "ແກ້ໄຂປະເພດສິນຄ້າສຳເລັດ");
              resetForm({ values: '' })
              fetchCategory()
            } catch (error) {
              console.log('error: ', error?.message);
              customizeToast("error", convertErrorMessage(error?.message));
            }
          }}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <Modal show={showEdit} onHide={handleCloseEdit}>
              <Modal.Header closeButton>
                <Modal.Title><b>ແກ້ໄຂປະເພດສິນຄ້າ</b></Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Row>
                  <Col sm="12">
                    <div>

                      <Form.Group className="mb-3">
                        <Form.Label>ຊື່ປະເພດສິນຄ້າ<span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="name" onChange={handleChange} isInvalid={!!errors.name} value={values.name} />
                        {errors.name ? (<div className="text-danger">{errors.name}</div>) : null}
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
        <Modal.Body>ຕ້ອງການລຶບປະເພດສິນຄ້ານີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={_handleCloseDelete}>
            ຍົກເລີກ
          </Button>
          <Button variant="primary" onClick={() => _confirmDeleteUser()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
      {/* deleteCategory */}
    </div>
  )
}
