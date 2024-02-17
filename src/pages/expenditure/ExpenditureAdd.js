import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Formik } from "formik";
import { RandomNumBer, formatDateDash } from "../../consts/function";
import {
  GET_CATEGORY_EXPENDITURE,
  CREATE_EXPENDITURE,
} from "../../apollo/expenditure/Query";
import Swal from "sweetalert2";
import Routs from "../../consts/router";
// import { ADMIN_COLOR } from "../../consts";

export default function ExpenditureAdd() {
  const history = useHistory();

  var dateNow = formatDateDash(new Date());
  const [numberRandomStdudent, setumberRandomStdudent] = useState();
  const [paymentMedthod, setpaymentMedthod] = useState("PAY_CASH");

  useEffect(() => {
    const _randomNumeber = RandomNumBer();
    getCategoryFinnace();
    if (_randomNumeber) {
      setumberRandomStdudent(_randomNumeber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [getCategoryFinnace, { data: categoryFinnace }] = useLazyQuery(
    GET_CATEGORY_EXPENDITURE
  );

  const [CreateFinnace] = useMutation(CREATE_EXPENDITURE);
  const _createFinnane = async (values) => {
    try {
      let data = {
        categoryExpenditureId: values?.categoryExpenditureId,
        name: values?.name,
        billNumeber: values?.numberBill,
        payer: values?.payer,
        typeMoney: values?.typeMoney,
        amount: values?.amount.toString().replaceAll(",", "").toString(),
        paydate: values.paydate,
        images: ["resPhoto"],
        detail: values?.detail,
        paymentMethod: paymentMedthod,
        status: "SUCCESS",
      };
      console.log("data: ", data);
      const resCreateFinnace = await CreateFinnace({ variables: { data } });
      if (resCreateFinnace?.data?.createExpenditure?.id) {
        Swal.fire({
          icon: "success",
          title: "ການບັນທຶກສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          history.push(`${Routs.EXPENDITURE_LIST + "/" + Routs.PAGE_GINATION}`);
          window.location.reload(true);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div
      className="body"
      style={{
        color: "#5C5C5C",
        fontSize: 16,
      }}
    >
      {numberRandomStdudent && (
        <Formik
          initialValues={{
            categoryExpenditureId: "",
            numberBill: numberRandomStdudent,
            payer: "",
            amount: "",
            name: "",
            typeMoney: "LAK",
            paydate: dateNow,
            detail: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.numberBill) {
              errors.numberBill = "ກະລຸນາປ້ອນຂໍ້ມູນ";
            }
            if (!values.typeMoney) {
              errors.typeMoney = "ກະລຸນາປ້ອນຂໍ້ມູນ";
            }
            if (!values.categoryExpenditureId) {
              errors.categoryExpenditureId = "ກະລຸນາເລືອກປະເພດ";
            }
            if (!values.amount) {
              errors.amount = "ກະລຸນາປ້ອນຈຳນວນເງິນ";
            } else if (values.amount < 0) {
              errors.amount = "ກະລຸນາປ້ອນເປັນຕົວເລກ";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createFinnane(values);
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
            <div
              className="form-row"
              style={{ paddingLeft: 20, paddingRight: 50 }}
            >
              <div className="col-12">
                <div
                  className="form-group"
                  style={{ paddingLeft: 20, paddingTop: 20 }}
                >
                  <h6>
                    <span
                      style={{ color: "#476FBC", cursor: "pointer" }}
                      onClick={() =>
                        history.push(
                          `${
                            Routs.EXPENDITURE_LIST + "/" + Routs.PAGE_GINATION
                          }`
                        )
                      }
                    >
                      ລາຍຈ່າຍ {">"}{" "}
                    </span>
                    ເພີ່ມລາຍຈ່າຍ
                  </h6>
                </div>
              </div>
              <div className="col-12 card-body" style={{ padding: 20 }}>
                <Card.Header
                  style={{
                    backgroundColor: "white",
                    color: "#476FBC",
                    fontWeight: "bold",
                  }}
                >
                  <p style={{ padding: 10, margin: 0 }}>ເພີ່ມລາຍຈ່າຍ</p>
                </Card.Header>
                <div className="form-row">
                  <div
                    className="col-12"
                    style={{ backgroundColor: "#F1F1F1" }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          margin: 5,
                        }}
                      >
                        ຂໍ້ມູນທົ່ວໄປ
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ height: 20 }}></div>
                  <div className="form-row">
                    <div className="col-4">
                      <div className="form-group">
                        <label>ເລກທີ່ໃບບິນ</label>
                        <div style={{ height: 5 }}></div>
                        <input
                          className="form-control"
                          type="text"
                          name="numberBill"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.numberBill}
                          defaultValue={numberRandomStdudent}
                        ></input>
                      </div>
                      <div style={{ color: "red" }}>
                        {errors.numberBill &&
                          touched.numberBill &&
                          errors.numberBill}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="from-group">
                        <label>ປະເພດ</label>
                        <div style={{ height: 5 }}></div>
                        <select
                          className="form-control"
                          type="text"
                          name="categoryExpenditureId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.categoryExpenditureId}
                        >
                          <option selected disabled value="">
                            ກະລຸນາເລືອກ
                          </option>
                          {categoryFinnace?.categoryExpenditures?.data?.map(
                            (item) => (
                              <option value={item?.id}>{item?.name}</option>
                            )
                          )}
                        </select>
                      </div>
                      <div style={{ color: "red" }}>
                        {errors.categoryExpenditureId &&
                          touched.categoryExpenditureId &&
                          errors.categoryExpenditureId}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label>ວັນເດືອນປີ</label>
                        <div style={{ height: 5 }}></div>
                        <input
                          type="date"
                          name="paydate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.paydate}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>ຫົວຂໍ້</label>
                        <div style={{ height: 5 }}></div>
                        <input
                          className="form-control"
                          placeholder="ກະລຸນາປ້ອນ"
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        ></input>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>ຜູ້ຮັບ</label>
                        <div style={{ height: 5 }}></div>
                        <input
                          className="form-control"
                          placeholder="ກະລຸນາປ້ອນ"
                          type="text"
                          name="payer"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.payer}
                        ></input>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>ຈຳນວນເງິນ</label>
                        <div style={{ height: 5 }}></div>
                        <input
                          className="form-control"
                          placeholder="ກະລຸນາປ້ອນ"
                          type="number"
                          name="amount"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.amount}
                        ></input>
                      </div>
                      <div style={{ color: "red" }}>
                        {errors.amount && touched.amount && errors.amount}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="from-group">
                        <label>ສະກຸນເງິນ</label>
                        <div style={{ height: 5 }}></div>
                        <select
                          className="form-control"
                          type="text"
                          name="typeMoney"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.typeMoney}
                        >
                          <option selected disabled value="">
                            ກະລຸນາເລືອກ
                          </option>
                          <option value="LAK">LAK</option>
                          <option value="THB">THB</option>
                          <option value="USD">USD</option>
                          <option value="CNY">CNY</option>
                        </select>
                      </div>
                      <div style={{ color: "red" }}>
                        {errors.typeMoney &&
                          touched.typeMoney &&
                          errors.typeMoney}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-row">
                        <div className="col">
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="PAY_CASH"
                              name="gender"
                              className="custom-control-input"
                              defaultChecked
                              onChange={() => setpaymentMedthod("PAY_CASH")}
                            />
                            <label
                              className="custom-control-label"
                              for="PAY_CASH"
                            >
                              ເງິນສົດ
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="PAY_ONLINE"
                              name="gender"
                              className="custom-control-input"
                              onChange={() => setpaymentMedthod("PAY_ONLINE")}
                            />
                            <label
                              className="custom-control-label"
                              for="PAY_ONLINE"
                            >
                              ເງິນໂອນ
                            </label>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 20 }}></div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div
                    className="col-12"
                    style={{ backgroundColor: "#F1F1F1" }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          margin: 5,
                        }}
                      >
                        ຮູບພາບ
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ height: 20 }}></div>
                <div style={{ paddingLeft: 10 }}>
                  <div className="form-row">
                    <dov className="col-12">
                      {/*  */}
                      <div className="form-group">
                        <div className="row">
                          {/* {resPhoto?.map((item) => <Badge badgeContent="X" color="secondary" style={{ padding: 10 }} onClick={() => _onDelete(item?.name)}> <ImageThumb image={item?.name} /></Badge>)} */}
                          <input
                            type="file"
                            id="file-upload"
                            // onChange={handleUpload}
                            hidden
                          />
                          <label for="file-upload">
                            <div
                              style={{
                                height: 140,
                                width: 140,
                                borderRadius: 8,
                                cursor: "pointer",
                                display: "flex",
                                backgroundColor: "#DDDDDD",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  height: 140,
                                  width: 140,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <i
                                  style={{ fontSize: 50, color: "#ffffff" }}
                                  className="fa fa-plus"
                                ></i>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </dov>
                  </div>
                  <div style={{ height: 15 }}></div>
                </div>

                <div className="form-row">
                  <div
                    className="col-12"
                    style={{ backgroundColor: "#F1F1F1" }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          margin: 5,
                        }}
                      >
                        ຄຳອະທິບາຍ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-12">
                    <div style={{ height: 20 }}></div>
                    <div className="form-group">
                      <label>ຄຳອະທິບາຍ</label>
                      <div style={{ height: 5 }}></div>
                      <textarea
                        className="form-control"
                        placeholder="ກະລຸນາປ້ອນ"
                        type="text"
                        name="detail"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.detail}
                      ></textarea>
                    </div>
                    <div style={{ height: 82 }}></div>
                  </div>
                </div>
                <div className="form-row" style={{ textAlign: "center" }}>
                  <div className="col-12">
                    <div className="form-group">
                      <button
                        className="btn-cancel-web"
                        onClick={() =>
                          history.push(
                            `${
                              Routs.EXPENDITURE_LIST + "/" + Routs.PAGE_GINATION
                            }`
                          )
                        }
                      >
                        ຍົກເລີກ
                      </button>
                      <button
                        type="submit"
                        className="btn-confirm-web"
                        // style={{ marginLeft: 82,backgroundColor:ADMIN_COLOR,color:"#fff" }}
                        onClick={() => handleSubmit()}
                      >
                        ຢືນຢັນ
                      </button>
                    </div>
                  </div>
                </div>
                {/* </CardContent> */}
                {/* </Card> */}
              </div>
            </div>
          )}
        </Formik>
      )}
    </div>
  );
}
