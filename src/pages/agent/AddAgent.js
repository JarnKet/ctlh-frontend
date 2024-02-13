import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

// Library
import { Form, Button, Row, Col, Breadcrumb, Card, Spinner } from "react-bootstrap";

// Components
import Loading from "../../common/Loading";

export default function AddAgent() {
  const CREATE_USER_AND_SHOP_AGENT = "http://localhost:8080/v1/api/shop-agent/shop-and-user";
  const GET_MANY_SHOP_TYPE = "http://localhost:8080/v1/api/shop-type";
  const S3_IMG_LINK = "https://ctlh-bucket.s3.ap-southeast-1.amazonaws.com/images/";

  const history = useHistory();
  const [shopType, setShopType] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [shopProfile, setShopProfile] = useState(null);

  const [popupLoading, setPopupLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageSpinner, setImageSpinner] = useState(false);

  useEffect(() => {
    const fetchShopType = async () => {
      setPopupLoading(true);
      try {
        const response = await fetch(GET_MANY_SHOP_TYPE);
        const data = await response.json();
        console.log(data.data.data);
        setShopType(data.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
      setPopupLoading(false);
    };

    fetchShopType();
  }, []);

  const _handleChangeFile = async (event, setImage) => {
    setImageSpinner(true);
    let data = event?.target?.files[0];
    //   setFileUpload(data);

    let presignData = JSON.stringify({ fileName: data.name });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/v1/api/file/presign-url",
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

    setImageSpinner(false);
  };

  const handleFormSubmit = (values) => {
    const prepareData = {
      userData: {
        firstName: values.firstName,
        lastName: values.lastName,
        nickName: values.nickName,
        image: ownerProfile,
        phone: values.phone,
        whatsapp: values.whatsapp,
        facebook: values.facebook,
        line: values.line,
        gender: values.gender,
        role: values.role,
        village: values.village,
        district: values.district,
        province: values.province,
        country: values.country,
        password: values.password,
        note: values.note,
      },
      shopData: {
        shopType: values.shopType,
        shopName: values.shopName,
        shopImage: shopProfile,
        shopPhone: values.shopPhone,
        villageShop: values.villageShop,
        districtShop: values.districtShop,
        provinceShop: values.provinceShop,
        countryShop: values.countryShop,
        location: values.location,
        noteShop: values.noteShop,
      },
    };

    console.log(prepareData);

    // setPopupLoading(true);
    try {
      const response = fetch(CREATE_USER_AND_SHOP_AGENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepareData),
      });
      console.log(response);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        history.push("/");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    // setPopupLoading(false);
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">ຕົວແທນ</Breadcrumb.Item>
        <Breadcrumb.Item active>ເພີ່ມຕົວແທນ</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 20 }}>
        <Formik
          initialValues={{
            //   User Data
            firstName: "",
            lastName: "",
            nickName: "",
            image: "",
            phone: "",
            whatsapp: "",
            facebook: "",
            line: "",
            gender: "",
            role: "AGENT",
            village: "",
            district: "",
            province: "",
            country: "",
            password: "",
            note: "",
            // Shop Data
            // FIXME: ກ່ອນສົ່ງໄປ Data Base ຢ່າລືມແປງດາຕ້າ
            shopType: "",
            shopName: "",
            shopImage: "",
            shopPhone: "",
            villageShop: "",
            districtShop: "",
            provinceShop: "",
            countryShop: "",
            location: "",
            noteShop: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            // setSubmitting(false);
            handleFormSubmit(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4} className="flexCenter" style={{ justifyContent: "flex-start", flexDirection: "column" }}>
                  <Card style={{ width: 300, height: 300 }}>
                    {ownerProfile ? (
                      <img src={S3_IMG_LINK + ownerProfile} alt="profile avatar" width={"100%"} style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="flexCenter" style={{ height: "100%" }}>
                        ອັບໂຫຼດຮູບພາບ
                      </div>
                    )}
                    {/* {imageSpinner ? <Spinner animation="border" /> : null} */}
                  </Card>
                  <Button style={{ margin: "10px 0", position: "relative" }}>
                    ອັບໂຫຼດຮູບພາບ
                    <input
                      type="file"
                      onChange={(e) => _handleChangeFile(e, setOwnerProfile)}
                      style={{ opacity: 0, position: "absolute", inset: 0, zIndex: 10 }}
                    />
                  </Button>
                </Col>
                <Col md={8}>
                  {/* ຂ້ໍມູນຜູ້ໃຊ້ User */}
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
                        <Form.Label>ປະເທດ</Form.Label>
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
                    {/* ຂໍ້ມູນຮ້ານ */}
                    <div style={{ backgroundColor: "var(--main2-color)", padding: 10, width: "100%", marginBottom: 10 }}>ຂໍ້ມູນຮ້ານ</div>
                    <Form.Group className="mb-3" controlId="shopType">
                      <Form.Label>ປະເພດຮ້ານ</Form.Label>
                      <Form.Select aria-label="shopType" name="shopType" onChange={handleChange} onBlur={handleBlur} value={values.shopType}>
                        <option>ເລືອກປະເພດຮ້ານ</option>
                        {shopType &&
                          shopType.map((item, index) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shopName">
                          <Form.Label>ຊື່ຮ້ານ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter shopName"
                            name="shopName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.shopName}
                            rows={5}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shopPhone">
                          <Form.Label>ເບີໂທຮ້ານ</Form.Label>
                          <Form.Control
                            type="phone"
                            placeholder="Enter shopPhone"
                            name="shopPhone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.shopPhone}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div style={{ width: "100%", height: 400, border: "1px solid var(--main2-color)", borderRadius: 10 }}>
                          {shopProfile ? (
                            <img src={S3_IMG_LINK + shopProfile} alt="shop" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                          ) : (
                            <div className="flexCenter" style={{ height: "100%" }}>
                              ອັບໂຫຼດຮູບພາບ
                            </div>
                          )}
                        </div>
                        <div style={{ margin: "10px auto" }} className="flexCenter">
                          <Button style={{ position: "relative" }}>
                            ອັບໂຫຼດຮູບພາບ
                            <input
                              type="file"
                              onChange={(e) => _handleChangeFile(e, setShopProfile)}
                              style={{ opacity: 0, position: "absolute", inset: 0, zIndex: 10 }}
                            />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="villageShop">
                          <Form.Label>ບ້ານ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter villageShop"
                            name="villageShop"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.villageShop}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="districtShop">
                          <Form.Label>ເມືອງ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter districtShop"
                            name="districtShop"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.districtShop}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="provinceShop">
                          <Form.Label>ແຂວງ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter provinceShop"
                            name="provinceShop"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.provinceShop}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Group className="mb-3" controlId="countryShop">
                        <Form.Label>ປະເທດ</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter countryShop"
                          name="countryShop"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.countryShop}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group className="mb-3" controlId="location">
                        <Form.Label>ລິ້ງຕຳແໜ່ງ</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter location"
                          name="location"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.location}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group className="mb-3" controlId="noteShop">
                        <Form.Label>ໝາຍເຫດ</Form.Label>
                        <Form.Control
                          as={"textarea"}
                          placeholder="Enter noteShop"
                          name="noteShop"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.noteShop}
                          rows={5}
                        />
                      </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" style={{ width: "100%" }}>
                      ເພີ່ມ Agent
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
      {popupLoading ? <Loading /> : null}
    </div>
  );
}
