import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik } from "formik";
import axios from "axios";
/**
 *
 * @Library
 */

import { Col, Row, Card, Button, Breadcrumb, Modal, Form } from "react-bootstrap";
import { dateTimeLao } from "../../helper";
import { customizeToast } from "../../helper/toast";

export default function AgentDetail() {
  // const GET_AGENT_DETAIL = "http://localhost:8080/v1/api/shop-agent/";
  // https://ctlh-api.selectoptions.net:8080/
  const GET_AGENT_DETAIL = "https://ctlh-api.selectoptions.net:8080/v1/api/shop-agent/";
  const USER_API = "https://ctlh-api.selectoptions.net:8080/v1/api/user/";

  const S3_IMG_LINK = "https://ctlh-bucket.s3.ap-southeast-1.amazonaws.com/images/";

  const [newUserProfile, setNewUserProfile] = useState(null);
  const [newShopProfile, setNewShopProfile] = useState(null);

  const history = useHistory();
  const { id } = useParams();
  const [agentDetail, setAgentDetail] = useState(null);

  // Event Trigger
  const [loading, setLoading] = useState(false);
  const [editUserFormModal, setEditUserFormModal] = useState(false);
  const [editAgentFormModal, setEditAgentFormModal] = useState(false);

  const fetchAgentDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(GET_AGENT_DETAIL + id);
      const responseData = await response.json();
      console.log(responseData.data);
      setAgentDetail(responseData.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgentDetail();
  }, [id]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  const _handleChangeFile = async (event, setImage) => {
    // setImageSpinner(true);
    let data = event?.target?.files[0];
    //   setFileUpload(data);

    let presignData = JSON.stringify({ fileName: data.name });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ctlh-api.selectoptions.net:8080/v1/api/file/presign-url",
      headers: {
        "Content-Type": "application/json",
      },
      data: presignData,
    };
    const responsePresignUrl = await axios.request(config);

    console.log("responsePresignUrl?.data?.url: ", responsePresignUrl?.data?.url);
    let uploadfile = await axios({
      method: "PUT",
      url: responsePresignUrl?.data?.url,
      data: data,
      headers: {
        "Content-Type": " file/*; image/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
      },
    });
    console.log("uploadfile: ", uploadfile);

    if (uploadfile.status === 200) {
      setImage(uploadfile?.config?.data?.name);
    }

    // setImageSpinner(false);
  };

  const _handleUserUpdate = async (values) => {
    try {
      const response = await axios.put(USER_API + "/" + agentDetail?.shopOwner?._id, values);

      console.log(response);

      if (response.status === 200) {
        fetchAgentDetail();
        setEditUserFormModal(false);
        customizeToast("success", "ອັບເດດຂໍ້ມູນເຈົ້າຂອງຮ້ານສຳເລັດ");
      }
    } catch (error) {
      customizeToast("error", "ອັບເດດຂໍ້ມູນເຈົ້າຂອງຮ້ານບໍ່ສຳເລັດ");
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push("/");
          }}
        >
          Agent
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{agentDetail?.shopName}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 20 }}>
        <Row>
          <Col md={4} className="flexCenter" style={{ alignItems: "flex-start", marginBottom: 10 }}>
            <Card style={{ width: "300px", height: 300, padding: 10 }}>
              {agentDetail?.shopOwner?.image ? (
                <img
                  src={S3_IMG_LINK + agentDetail?.shopOwner?.image}
                  alt="profile avatar"
                  width={"100%"}
                  height={200}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div>ບໍ່ມີຮູບພາບ</div>
              )}

              <h2 style={{ textAlign: "center", margin: "10px 0" }}>
                {agentDetail?.shopOwner?.firstName} {agentDetail?.shopOwner?.lastName}
              </h2>
              <small style={{ textAlign: "center", marginBottom: 10 }}>ວັນທີເພີ່ມ: {dateTimeLao(agentDetail?.createdAt)}</small>
              {/* <Button
                onClick={() => {
                  //   history.push(AGENT_EDIT + "/" + id);
                }}
              >
                ແກ້ໄຂ
              </Button> */}
            </Card>
          </Col>
          <Col md={8} className="flexCenter">
            <Card style={{ width: "90%", padding: 10 }}>
              <h2>ລາຍລະອຽດຂໍ້ມູນຕົວແທນ</h2>
              {/* ຂໍ້ມູນເຈົ້າຂອງຮ້ານ */}
              <div style={{ padding: 10, background: "var(--main2-color)", marginBottom: 10 }} className="flexBetween">
                <p>ຂໍ້ມູນເຈົ້າຂອງຮ້ານ</p>
                <Button onClick={() => setEditUserFormModal(true)}>ແກ້ໄຂຂໍ້ມູນເຈົ້າຂອງຮ້ານ</Button>
              </div>
              <div className="flexBetween">
                <p className="">ລະຫັດຜູ້ໃຊ້:</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.userCode}</p>
              </div>
              <div className="flexBetween">
                <p className="">ຊຶ່ ແລະ ນາມສະກຸນ:</p>
                <p style={{ fontWeight: "bold" }}>
                  {agentDetail?.shopOwner?.firstName} {agentDetail?.shopOwner?.lastName}
                </p>
              </div>
              <div className="flexBetween">
                <p className="">ຊຶ່ຫຼິ້ນ:</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.nickName}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເພດ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.gender === "MALE" ? "ຊາຍ" : "ຍິງ"}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເບີໂທ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.phone}</p>
              </div>
              <div className="flexBetween">
                <p className="">ທີ່ຢູ່</p>
                <p style={{ fontWeight: "bold" }}>
                  ບ້ານ{agentDetail?.shopOwner?.village}, ເມືອງ{agentDetail?.shopOwner?.district}, {agentDetail?.shopOwner?.province}
                </p>
              </div>
              <div className="flexBetween">
                <p className="">Whatsapp</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.whatsapp || "-"}</p>
              </div>
              <div className="flexBetween">
                <p className="">Facebook</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.facebook || "-"}</p>
              </div>
              <div className="flexBetween">
                <p className="">Line</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.line || "-"}</p>
              </div>
              <div>
                <p className="">ໝາຍເຫດ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.note || "-"}</p>
              </div>
              {/* ຂໍ້ມູນຮ້ານ */}
              <div style={{ padding: 10, background: "var(--main2-color)", marginBottom: 10 }} className="flexBetween">
                <p>ຂໍ້ມູນຮ້ານ</p>
                <Button>ແກ້ໄຂຂໍ້ມູນຮ້ານ</Button>
              </div>
              <div className="flexBetween">
                <p className="">ຊື່ຮ້ານ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopName}</p>
              </div>
              <div className="flexBetween">
                <p className="">ປະເພດຮ້ານ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopType?.name}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເບີໂທ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopPhone}</p>
              </div>
              <div>
                <p className="">ຮູບພາບຮ້ານ</p>
                {agentDetail?.shopImage ? (
                  <img
                    src={S3_IMG_LINK + agentDetail?.shopImage}
                    alt="profile avatar"
                    width={"100%"}
                    height={200}
                    style={{ objectFit: "cover", margin: "10px 0" }}
                  />
                ) : (
                  <div>ບໍ່ມີຮູບພາບ</div>
                )}
              </div>
              <div className="flexBetween">
                <p className="">ຕັ້ງຢູ່ທີ່:</p>
                <p style={{ fontWeight: "bold" }}>
                  {agentDetail?.village}, {agentDetail?.district}, {agentDetail?.province}
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal centered show={editUserFormModal} onHide={() => setEditUserFormModal(false)} style={{ maxHeight: 600, overflowY: "scroll" }}>
        <Modal.Header closeButton>
          <Modal.Title>ແກ້ໄຂຂໍ້ມູນເຈົ້າຂອງຮ້ານ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              //   User Data
              firstName: agentDetail?.shopOwner?.firstName || "",
              lastName: agentDetail?.shopOwner?.lastName || "",
              nickName: agentDetail?.shopOwner?.nickName || "",
              image: "",
              phone: agentDetail?.shopOwner?.phone || "",
              whatsapp: agentDetail?.shopOwner?.whatsapp || "",
              facebook: agentDetail?.shopOwner?.facebook || "",
              line: agentDetail?.shopOwner?.line || "",
              gender: agentDetail?.shopOwner?.gender || "",
              // role: "AGENT",
              village: agentDetail?.shopOwner?.village || "",
              district: agentDetail?.shopOwner?.district || "",
              province: agentDetail?.shopOwner?.province || "",
              country: agentDetail?.shopOwner?.country || "",
              password: agentDetail?.shopOwner?.village || "",
              note: agentDetail?.shopOwner?.village || "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              // setSubmitting(false);
              // handleFormSubmit(values);

              if (newUserProfile) {
                values.image = newUserProfile;
              }

              _handleUserUpdate(values);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* <Col md={4} className="flexCenter" style={{ justifyContent: "flex-start", flexDirection: "column" }}></Col> */}
                  <Col md={12}>
                    {/* ຂ້ໍມູນຜູ້ໃຊ້ User */}
                    <div className="flexCenter" style={{ flexDirection: "column" }}>
                      <Card style={{ width: 300, height: 300 }}>
                        {newUserProfile ? (
                          <img src={S3_IMG_LINK + newUserProfile} alt="profile avatar" width={"100%"} style={{ objectFit: "cover" }} />
                        ) : (
                          <div className="flexCenter" style={{ height: "100%" }}>
                            ອັບໂຫຼດຮູບພາບໃໝ່
                          </div>
                        )}
                        {/* {imageSpinner ? <Spinner animation="border" /> : null} */}
                      </Card>
                      <Button style={{ margin: "10px 0", position: "relative" }}>
                        ອັບໂຫຼດຮູບພາບໃໝ່
                        <input
                          type="file"
                          onChange={(e) => {
                            _handleChangeFile(e, setNewUserProfile);
                          }}
                          style={{ opacity: 0, position: "absolute", inset: 0, zIndex: 10 }}
                        />
                      </Button>
                    </div>
                    <Card style={{ padding: 20 }}>
                      <div style={{ backgroundColor: "var(--main2-color)", padding: 10, width: "100%", marginBottom: 10 }}>ຂໍ້ມູນທົ່ວໄປ</div>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>ຊື່ແທ້</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter name"
                              name="firstName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.firstName}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>ນາມສະກຸນ</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter phone"
                              name="lastName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.lastName}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="nickName">
                            <Form.Label>ຊື່ຫຼິ້ນ</Form.Label>
                            <Form.Control
                              type="nickName"
                              placeholder="Enter nickName"
                              name="nickName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.nickName}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>ເພດ</Form.Label>
                            <Form.Select aria-label="gender" name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur}>
                              <option>ເລືອກເພດ</option>
                              <option value="MALE">ຊາຍ</option>
                              <option value="FEMALE">ຍິງ</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="phone"
                              placeholder="Enter Phone"
                              name="phone"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.phone}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Form.Group className="mb-3" controlId="password">
                          <Form.Label>ລະຫັດຜ່ານ</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="whatsapp">
                            <Form.Label>Whatsapp</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter whatsapp"
                              name="whatsapp"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.whatsapp}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="facebook">
                            <Form.Label>Facebook</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter facebook"
                              name="facebook"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.facebook}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="line">
                            <Form.Label>Line</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter line"
                              name="line"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.line}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="village">
                            <Form.Label>ບ້ານ</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter village"
                              name="village"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.village}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="district">
                            <Form.Label>ເມືອງ</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter district"
                              name="district"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.district}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="province">
                            <Form.Label>ແຂວງ</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter province"
                              name="province"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.province}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Form.Group className="mb-3" controlId="country">
                          <Form.Label>ສັນຊາດ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter country"
                            name="country"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.country}
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group className="mb-3" controlId="note">
                          <Form.Label>ໝາຍເຫດ</Form.Label>
                          <Form.Control
                            as={"textarea"}
                            placeholder="Enter note"
                            name="note"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.note}
                            rows={5}
                          />
                        </Form.Group>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <div className="flexCenter" style={{ gap: 10, margin: "10px 0" }}>
                  <Button variant="secondary" onClick={() => setEditUserFormModal(false)}>
                    ຍົກເລີກ
                  </Button>
                  <Button className="bg-primary" type="submit">
                    ຢືນຢັນ
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUserFormModal(false)}>
            ຍົກເລີກ
          </Button>
          <Button className="bg-primary" onClick={() => {}}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}
