import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Modal } from "react-bootstrap";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Library
 */
import moment from "moment";
import { ADMIN_COLOR } from "../../consts";
/**
 * @Component
 */
import { Form, Col, Row, Breadcrumb, Table, Spinner } from "react-bootstrap";
import {faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
/**
 * @Apollo
 */
/**
 * @Function
 */
import { dateTimeLao } from "../../helper/index";
import PaginationHelper from "../../helper/PaginationHelper";
import { GET_CATEGORY_EXPENDITURE } from "../../apollo/expenditure/Query";
import {
  CREATE_EXPENDITURE_CATEGORY,
  DELETE_EXPENDITURE_CATEGORY,
  EDIT_EXPENDITURE_CATEGORY
} from "../../apollo/expenditure/Mutation";
import { formatDateDash } from "../../consts/function";
import Navbar from "./Navbar";
import { Error, Success } from "../../helper/sweetalert";
import { currency } from '../../helper/index'
import { customizeToast } from '../../helper/toast';

export default function ExpenditureCategoryList() {
  var dateNow = formatDateDash(new Date());
  var dateLast = moment("2023-05-01").format("YYYY-MM-DD");
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [nameSearch, setNameSearch] = useState("");
  const [createdAtStartSearch, setCreatedAtStartSearch] = useState(dateLast);
  const [createdAtEndSearch, setCreatedAtEndSearch] = useState(dateNow);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [categoriesFinance, setCategoriesFinance] = useState([]);
  const [totals, setTotals] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (data) => {
    setDataSelect(data);
    setShowDelete(true);
  };
  
  const [showEdit, setShowEdite] = useState(false);
  const handleCloseEdite = () => setShowEdite(false);
  const handleShowEdite = (data) => {
    setDataSelect(data);
    setShowEdite(true);
  };
  /**
   *
   * @Apollo
   *
   */
  const [getCategoryFinnace, { data: categoryFinnace }] = useLazyQuery(GET_CATEGORY_EXPENDITURE,{fetchPolicy: "network-only" });

  useEffect(() => {
    fetchUserData();
    getCategoryFinnace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameSearch, createdAtStartSearch, createdAtEndSearch]);

  useEffect(() => {
    setCategoriesFinance(categoryFinnace?.categoryExpenditures?.data)
    setTotals(categoryFinnace?.categoryExpenditures?.total)
  }, [categoryFinnace]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      await getCategoryFinnace({
        variables: {
          where: {
            name: nameSearch ? nameSearch : undefined,
            createdAtStart: createdAtStartSearch,
            createdAtEnd: createdAtEndSearch,
          },
          skip: (_skip - 1) * _limit,
          limit: _limit,
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const [CreateCategoryExpendi] = useMutation(CREATE_EXPENDITURE_CATEGORY);
  const _createCategoryExpenditure = async (data) => {
    try {
      const resCreateFinnace = await CreateCategoryExpendi({
        variables: { data },
      });
      if (resCreateFinnace?.data?.createCategoryExpenditure?.id) {
        handleClose();
        Success("ການບັນທຶກສຳເລັດ");
        fetchUserData();
      }
    } catch (error) {
      Error(error);
    }
  };

  const [DeleteCategoryExxpendi] = useMutation(DELETE_EXPENDITURE_CATEGORY);

  const _deleteCategoryExpen = async () => {
    try {
      const resCreateUser = await DeleteCategoryExxpendi({
        variables: {
          where: { id: dataSelect?.id },
        },
      });
      if (resCreateUser?.data?.deleteCategoryExpenditure?.id) {
        handleCloseDelete();
        Success("ການລົບສຳເລັດ");
        fetchUserData();
      }
    } catch (error) {
      Error(error);
    }
  };

  const [editCategoryExpendi] = useMutation(EDIT_EXPENDITURE_CATEGORY);
  const _editCategoryExpenditure=async(data)=>{
    try {
      if(data?.name ===dataSelect?.name){
        delete data?.name
      }
      const resCreateFinnace = await editCategoryExpendi({
        variables: { data,where: { id: dataSelect?.id } },
      });
      if (resCreateFinnace?.data?.updateCategoryExpenditure?.id) {
        handleCloseEdite();
        Success("ແກ້ໄຂສຳເລັດ");
        fetchUserData();
      }
    } catch (error) {
      Error(error);
    }
  }

  const _selectCodeForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກ ຊື່ໝວດລາຍຈ່າຍ ແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ໝວດລາຍຈ່າຍ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Navbar />
      <div className="card-title">
        <Row>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ຄົ້ນຫາ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ປ້ອນຊື່ໝວດລາຍຈ່າຍ"
                onChange={(e) => {
                  setNameSearch(e?.target?.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີສ້າງເລີມ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateLast}
                onChange={(e) => {
                  setCreatedAtStartSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີສ້າງສິນສຸດ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateNow}
                onChange={(e) => {
                  setCreatedAtEndSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
        <h4 className="text-primary"><b>ໝວດລາຍຈ່າຍ ({currency(totals)})</b></h4>
          <button className="btn-primary-web" onClick={() => handleShow()}>
            + ເພີ່ມໝວດລາຍຈ່າຍ
          </button>
        </div>

        <div className="margin-top">
          {isLoading ? (
            <div className="loading-page">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ຊື່ໝວດລາຍຈ່າຍ</th>
                  <th>ໝາຍເຫດ</th>
                  <th>ວັນເດືອນປີ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              {categoriesFinance.map(
                (item, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{index + 1 + _limit * (_skip - 1)}</td>
                        <td>{item?.name} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.name)} /></td>
                        <td>{item?.note}</td>
                        <td>
                          <div>
                            <div>{item?.createdBy?.fullName}</div>
                            <div>{dateTimeLao(item?.createdAt)}</div>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn-list-edit"
                            onClick={(e) => handleShowEdite(item)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn-list-delete"
                            onClick={() => handleShowDelete(item)}
                          >
                            <FontAwesomeIcon icon={faTrash} />{" "}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
              )}
            </Table>
          )}
          {Pagination_helper(
            categoryFinnace?.categoryExpenditures?.total,
            Routs.EXPENDITURE_CATEGORY
          )}
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Formik
          initialValues={{
            name: "",
            note: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ໝວດລາຍຈ່າຍ";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createCategoryExpenditure(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>ເພີ່ມໝວດລາຍຈ່າຍ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>ຊື່ໝວດລາຍຈ່າຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ປ້ອນຊື່ໝວດລາຍຈ່າຍ"
                  />
                  <div style={{ color: "red" }}>
                    {errors.name && touched.name && errors.name}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder="ປ້ອນໝາຍເຫດ"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: ADMIN_COLOR,
                    color: "#fff",
                    border: "solid 0px",
                  }}
                  onClick={() => handleSubmit()}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      {/* ==== */}
      <Modal
        show={showEdit}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        {dataSelect &&
        <Formik
          initialValues={{
            name: dataSelect?.name,
            note: dataSelect?.note,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ໝວດລາຍຈ່າຍ";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _editCategoryExpenditure(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>ແກ້ໄຂໝວດລາຍຈ່າຍ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>ຊື່ໝວດລາຍຈ່າຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ປ້ອນຊື່ໝວດລາຍຈ່າຍ"
                  />
                  <div style={{ color: "red" }}>
                    {errors.name && touched.name && errors.name}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder="ປ້ອນໝາຍເຫດ"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdite}>
                  ຍົກເລີກ
                </Button>
                <Button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: ADMIN_COLOR,
                    color: "#fff",
                    border: "solid 0px",
                  }}
                  onClick={() => handleSubmit()}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
}
      </Modal>
      {/* ==== */}
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນລຶບສິນຄ້າ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການລຶບຂໍ້ມູນນີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            ຍົກເລີກ
          </Button>
          <Button className='bg-primary' onClick={() => _deleteCategoryExpen()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
