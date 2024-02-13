import React, { useState, useEffect } from "react";

/**
 * @Library
 */

import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Formik } from "formik";
import { useMediaQuery } from "@uidotdev/usehooks";

/**
 * @Component
 */

/**
 *
 * @Constant
 *
 */
import Routs from "../../consts/router";
import { USER_KEY } from "../../consts";
/**
 *
 * @Apollo
 *
 */
import { LOGIN_USER } from "./apollo/mutation";
/**
 *
 * @Function
 *
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Loading from "../../common/Loading";

export default function LoginPage() {
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [selectType, setSelectType] = useState("HOME");
  const [checkInputUserNameDataEmpty, setCheckInputUserNameDataEmpty] = useState(false);
  const [checkInputPasswordDataEmpty, setCheckInputPasswordDataEmpty] = useState(false);
  const [checkUserNameAndPassword, setCheckUserNameAndPassword] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER);
  console.log("selectType: ", selectType);

  useEffect(() => {
    if (isMobileOrTablet) {
      setSelectType("ENTRY_EXIT");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _clickLogin = async (data) => {
    try {
      setIsLoading(true);
      const _dataRespond = await loginUser({
        variables: {
          data,
        },
      });
      if (_dataRespond?.data?.loginUser) {
        setIsLoading(false);
        localStorage.setItem(USER_KEY, JSON.stringify(_dataRespond?.data?.loginUser));
        if (selectType === "ENTRY_EXIT") {
          history.push("entry-exit");
        } else {
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "DASHBOARD") {
            history.push(Routs.DASHBOARD_PAGE);
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "BILL") {
            history.push(Routs.OPEN_BILL);
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "PRODUCT") {
            history.push(Routs.PRODUCT_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "SERVICE") {
            history.push(Routs.SERVICE_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "EXPENDITURE") {
            history.push(Routs.EXPENDITURE_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "USER") {
            history.push(Routs.USER_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "ENTRY_EXIT") {
            history.push(Routs.ENTRY_EXIT_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "ABSENT") {
            history.push(Routs.ABSENT_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "PROMOTION") {
            history.push(Routs.PROMOTION_LIST + "/limit/30/skip/1/");
          }
          if (_dataRespond?.data?.loginUser?.data?.manageFuntion?.[0] === "DUTY") {
            history.push(Routs.DUTY);
          }
        }
      }
    } catch (err) {
      console.log("err", err);
      setCheckUserNameAndPassword(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        {isLoading ? <Loading /> : <></>}
        <Formik
          initialValues={{
            userId: "",
            password: "",
          }}
          onSubmit={(values) => {
            setCheckUserNameAndPassword(false);
            if (!values.userId) {
              setCheckInputUserNameDataEmpty(true);
            } else {
              setCheckInputUserNameDataEmpty(false);
              setCheckUserNameAndPassword(false);
            }
            if (!values.password) {
              setCheckInputPasswordDataEmpty(true);
            } else {
              setCheckInputPasswordDataEmpty(false);
              setCheckUserNameAndPassword(false);
              let newData = {
                userId: values.userId,
                password: values.password,
              };
              _clickLogin(newData);
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <section style={{ overflow: "hidden", height: "100vh" }}>
              <div>
                <div className="image-login" alt="banner" />
              </div>
              {/* <div className='imgBx'>
                <img src='/assets/image/background-login.jpg' alt='login' />
              </div>
              <div className='contentBx'>
                <div className='formBx'>
                  <h2>ເຂົ້າສູ່ລະບົບ</h2>
                  <form>
                    <div className='inputBx'>
                      <span>ຊື່ຜູ້ໃຊ້</span>
                      <input type='text' placeholder="ກາລຸນາປ້ອນ" name="userId" value={values.userId} onChange={handleChange} />
                      {checkInputUserNameDataEmpty === false ? "" : <span className="login-text-muted">
                        ກາລຸນາປ້ອນຊື່ບັນຊີ
                      </span>}
                    </div>
                    <div className='inputBx'>
                      <span>ລະຫັດຜ່ານ</span>
                      <input type='password' placeholder="********" name="password" value={values.password} onChange={handleChange}
                        onKeyDown={(e) => e.key === "Enter" ? handleSubmit() : ""}
                      />
                      {checkInputPasswordDataEmpty === false ? "" : <span className="login-text-muted"> ກາລຸນາປ້ອນລະຫັດຜ່ານ </span>}
                      {checkUserNameAndPassword === false ? "" : <span className="login-text-muted"> ຊື່ບັນຊີ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! </span>}
                    </div>
                    <div>
                      <div style={{ display: "flex" }}>
                        <input type="radio" name="selectType" defaultChecked={true} onChange={() => setSelectType("ENTRY_EXIT")} />
                        <div>ເຂົ້າເພື່ອໝາຍເຂົ້າ-ອອກວຽກ</div>
                      </div>
                      <div style={{ display: "flex" }}>
                        <input type="radio" name="selectType" onChange={(e) => setSelectType("HOME")} />
                        <div>ເຂົ້າເພື່ອຈັດການ</div>
                      </div>
                    </div>
                    <br />

                    <div className='inputBx'>
                      <label><input type="button" value="ເຂົ້າສູ່ລະບົບ" onClick={handleSubmit} /></label>
                    </div>
                  </form>
                </div>
              </div> */}

              <form className="login-form">
                {/* <h1 className="font-login">Medical Clinic</h1> */}
                <img src="/assets/image/banner.jpg" alt="logo" width={300} style={{ display: "block", margin: "0 auto" }} />
                <label for="username">ຊື່ຜູ້ໃຊ້</label>
                <input
                  type="text"
                  className="input-user"
                  placeholder="ກາລຸນາປ້ອນ"
                  name="userId"
                  value={values.userId}
                  onChange={handleChange}
                  required
                />
                {checkInputUserNameDataEmpty === false ? "" : <div className="login-text-muted">ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້</div>}
                <label for="password">ລະຫັດຜ່ານ</label>
                <input
                  type="password"
                  className="input-pass"
                  placeholder="********"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onKeyDown={(e) => (e.key === "Enter" ? handleSubmit() : "")}
                  required
                />
                {checkInputPasswordDataEmpty === false ? "" : <span className="login-text-muted"> ກາລຸນາປ້ອນລະຫັດຜ່ານ </span>}
                {checkUserNameAndPassword === false ? "" : <span className="login-text-muted"> ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! </span>}
                <br />
                <br />
                <div className="radio-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
                  {!isMobileOrTablet ? (
                    <div>
                      <input
                        type="radio"
                        className="radio-custom"
                        name="selectType"
                        style={{ marginRight: 4 }}
                        defaultChecked
                        onChange={() => setSelectType("HOME")}
                      />
                      <label>ເຂົ້າເພື່ອຈັດການ</label>
                    </div>
                  ) : null}

                  <div>
                    <input
                      type="radio"
                      style={{ marginLeft: 8, marginRight: 4 }}
                      name="selectType"
                      defaultChecked={isMobileOrTablet}
                      onChange={() => setSelectType("ENTRY_EXIT")}
                    />
                    <label>ເຂົ້າເພື່ອໝາຍເຂົ້າ-ອອກວຽກ</label>
                  </div>
                </div>
                <br />
                <button className="btn-login" onClick={handleSubmit}>
                  ເຂົ້າສູ່ລະບົບ
                </button>
              </form>
            </section>
          )}
        </Formik>
      </div>

      {/* <Formik
        initialValues={{
          userId: "",
          password: "",
        }}
        onSubmit={(values) => {
          setCheckUserNameAndPassword(false)
          if (!values.userId) {
            setCheckInputUserNameDataEmpty(true);
          } else {
            setCheckInputUserNameDataEmpty(false)
            setCheckUserNameAndPassword(false)
          }
          if (!values.password) {
            setCheckInputPasswordDataEmpty(true);
          } else {
            setCheckInputPasswordDataEmpty(false);
            setCheckUserNameAndPassword(false)
            let newData = {
              userId: values.userId,
              password: values.password,
            };
            _clickLogin(newData)
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <div className="login-page">
            <img className='bg-login-image' src='/assets/image/background-login.jpg' alt='bgimage' />
            <div className="form-login">
              <p className="login-tag-p">TD ADMIN</p>
              <div className="login-form-input">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className='text-white'>ຊື່ບັນຊີ <span className="login-tag-span">*</span></Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text><FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      className='input-box'
                      placeholder="ກາລຸນາປ້ອນ"
                      name="userId"
                      value={values.userId}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {checkInputUserNameDataEmpty === false ? "" : <span className="login-text-muted">
                    ກາລຸນາປ້ອນຊື່ບັນຊີ
                  </span>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className='text-white'>ລະຫັດ <span className="login-tag-span">*</span></Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text><FontAwesomeIcon icon={faUnlock} />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      className='input-box'
                      placeholder="********"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" ? handleSubmit() : ""}
                    />
                  </InputGroup>
                  {checkInputPasswordDataEmpty === false ? "" : <span className="login-text-muted"> ກາລຸນາປ້ອນລະຫັດຜ່ານ </span>}
                  {checkUserNameAndPassword === false ? "" : <span className="login-text-muted"> ຊື່ບັນຊີ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! </span>}
                </Form.Group>
                <button onClick={handleSubmit} className="login-btn">
                  ເຂົ້າສູ່ລະບົບ
                </button>

              </div>
            </div>
          </div>
        )}

      </Formik> */}
    </>
  );
}
