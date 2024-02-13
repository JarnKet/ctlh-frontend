import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Formik } from "formik";
import { Breadcrumb, Row, Col, Form } from "react-bootstrap";
import UploadPhoto from "../../helper/UploadPhoto";
import "react-toastify/dist/ReactToastify.css";
import { customizeToast } from "../../helper/toast";
import * as Yup from "yup";
import Routs from "../../consts/router";
import { UPDATE_PRODUCT } from "../../apollo/product/Mutation";
import { GET_CATEGORY } from "../../apollo/category/Query";
import { GET_PRODUCT } from "../../apollo/product/Query";
export default function ProductEdit() {
  const history = useHistory();
  const match = useRouteMatch();

  const productId = match?.params?.id
  const [dataCategory, setDataCategory] = useState([])
  const [dataProduct, setDataProduct] = useState({})

  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  /**
   *
   * @Function
   *
   */
  const [loadDataProduct, { data: apolloDataProduct }] = useLazyQuery(GET_PRODUCT, { fetchPolicy: "network-only" });
  const [loadDataCategory, { data: apolloDataCatgory }] = useLazyQuery(GET_CATEGORY, { fetchPolicy: "network-only" });

  const onSubmitEditProduct = async (newData) => {
    try {
      await updateProduct({
        variables: {
          data: newData?.data,
          where: { id: productId }
        },
      });
      customizeToast("success", "ແກ້ໄຂສິນຄ້າສຳເລັດ");
      history.push(Routs.PRODUCT_LIST + "/limit/30/skip/1");
    } catch (error) {
        console.log('error', error)
        if (error.message === "BARCODE_IS_READY")
        customizeToast("warning", "Barcode ນີ້ມີຢູ່ແລ້ວ!");
    }
  };
  const SignupSchema = Yup.object().shape({
    barcode: Yup.string().required("ກະລຸນາປ້ອນເລກ Barcode!"),
    categoryId: Yup.string().required("ກະລຸນາເລືອກປະເພດສິນຄ້າກ່ອນ!"),
    name: Yup.string().required("ກະລຸນາປ້ອນຊື່ສິນຄ້າກ່ອນ!"),
    buyPrice: Yup.string().required("ກະລຸນາປ້ອນລາຄາຊຶ້ກ່ອນ!"),
    sellPice: Yup.string().required("ກະລຸນາປ້ອນລາຄາຂາຍກ່ອນ!"),
    typeMoney: Yup.string().required("ກະລຸນາເລືອກສະກຸນກ່ອນ!"),
  });

  /**
   *
   * @UseEffect
   *
   */
  useEffect(() => {
    loadDataCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if(productId) {
      loadDataProduct({ variables: { where: { id: productId } } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])
  
  useEffect(() => {
    if(apolloDataCatgory) setDataCategory(apolloDataCatgory?.categorys?.data)
  }, [apolloDataCatgory])

  useEffect(() => {
    if(apolloDataProduct) setDataProduct(apolloDataProduct?.product)
  }, [apolloDataProduct])

  const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();
  return (
    <>
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={() => history.goBack()}>
            ສິນຄ້າ
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#" active>
            ເພີ່ມສິນຄ້າ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-add">
        <h4>
          <b>ແກ້ໄຂສິນຄ້າ</b>
        </h4>
        <hr />
        <div className="card-add-body">
          {dataProduct && 
          <Formik
            enableReinitialize
            initialValues={{
              barcode: dataProduct?.barcode || "",
              categoryId: dataProduct?.categoryId?.id || "",
              name: dataProduct?.name || "",
              buyPrice: dataProduct?.buyPrice || "",
              sellPice: dataProduct?.sellPice || "",
              typeMoney: dataProduct?.typeMoney || "",
              detail: dataProduct?.detail || "",
              note: dataProduct?.note || "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              if(values?.barcode === dataProduct?.barcode) delete values?.barcode;
              onSubmitEditProduct({ data: { ...values, image: namePhoto } });
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <Row>
                <Col sm="3">
                  <h5>
                    <b>ອັບໂຫຼດຮູບພາບ</b>
                  </h5>
                  {buttonUploadAndShowPhoto()}
                </Col>
                <Col sm="9">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Barcode<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ກະລຸນາເພີ່ມ"
                      name="barcode"
                      onChange={handleChange}
                      isInvalid={!!errors.barcode}
                      value={values.barcode}
                    />
                    {errors.barcode ? (
                      <div className="text-danger">{errors.barcode}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ປະເພດສິນຄ້າ<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="categoryId"
                      onChange={handleChange}
                      isInvalid={!!errors.categoryId}
                      value={values.categoryId}
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
                    {errors.categoryId ? (
                      <div className="text-danger">{errors.categoryId}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ຊື່ສິນຄ້າ<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ກະລຸນາເພີ່ມ"
                      name="name"
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      value={values.name}
                    />
                    {errors.name ? (
                      <div className="text-danger">{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ລາຄາຊຶ້<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="ກະລຸນາເພີ່ມ"
                      name="buyPrice"
                      onChange={handleChange}
                      isInvalid={!!errors.buyPrice}
                      value={values.buyPrice}
                    />
                    {errors.buyPrice ? (
                      <div className="text-danger">{errors.buyPrice}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ລາຄາຂາຍ<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="ກະລຸນາເພີ່ມ"
                      name="sellPice"
                      onChange={handleChange}
                      isInvalid={!!errors.sellPice}
                      value={values.sellPice}
                    />
                    {errors.sellPice ? (
                      <div className="text-danger">{errors.sellPice}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ສະກຸນເງິນທີ່ຈ່າຍ<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="typeMoney"
                      onChange={handleChange}
                      isInvalid={!!errors.typeMoney}
                      value={values.typeMoney}
                    >
                      <option value="">ກາລຸນາເລືອກ</option>
                      <option value="LAK">ກີບ</option>
                      <option value="THB">ບາດ</option>
                      <option value="USD">ໂດລ່າ</option>
                    </Form.Select>
                    {errors.typeMoney ? (
                      <div className="text-danger">{errors.typeMoney}</div>
                    ) : null}
                  </Form.Group>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>ລາຍລະອຽດ</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="text"
                      placeholder="ປ້ອນລາຍລະອຽດ"
                      name="detail"
                      onChange={handleChange}
                      value={values.detail}
                    />
                  </Form.Group> */}
                  <Form.Group className="mb-3">
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="text"
                      placeholder="ກະລຸນາເພີ່ມ"
                      name="note"
                      onChange={handleChange}
                      value={values.note}
                    />
                  </Form.Group>
                  <div className="card-add-bottom">
                    <button
                      className="btn-cancel-web"
                      onClick={() => history.push(Routs.PRODUCT_LIST + '/limit/30/skip/1')}
                    >
                      ຍົກເລີກ
                    </button>
                    <button className="btn-confirm-web" onClick={handleSubmit}>
                      ບັນທືກ
                    </button>
                  </div>
                </Col>
              </Row>
            )}
          </Formik>
          }
        </div>
      </div>
    </>
  );
}
