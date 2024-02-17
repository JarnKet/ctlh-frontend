import { useState, useEffect } from "react";
/**
 * @Library
 */
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@uidotdev/usehooks";

/**
 * @Component
 */
import { Form, Col, Row, Table, Spinner, Modal, Button, Breadcrumb } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * @CONSTANT
 */
import { customizeToast } from "../../helper/toast";

import { AGENT_DETAIL } from "../../consts/router";
import { dateTimeLao } from "../../helper";

export default function AgentList() {
  // const GET_ALL_SHOP_AGENT = "http://localhost:8080/v1/api/shop-agent/";
  const GET_ALL_SHOP_AGENT = "https://ctlh-api.selectoptions.net:8080/v1/api/shop-agent/";
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Data
  const [shopAgentList, setShopAgentList] = useState(null);
  const [deleteAgentId, setDeleteAgentId] = useState(null);

  // Event Trigger
  const [isLoading, setIsLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  // Filter
  const [shopName, setShopName] = useState(null);
  const [shopPhone, setShopPhone] = useState(null);
  const [shopCode, setShopCode] = useState(null);

  const fetchShopAgent = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GET_ALL_SHOP_AGENT, {
        params: {
          shopName: shopName,
          shopPhone: shopPhone,
          shopCode: shopCode,
        },
      });
      console.log(response.data.data.data);
      setShopAgentList(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShopAgent();
  }, [shopName, shopPhone, shopCode]);

  const _handleDeleteAgent = async () => {
    const response = await fetch(GET_ALL_SHOP_AGENT + deleteAgentId, {
      method: "DELETE",
    });
    const responseData = await response.json();
    console.log(responseData);
    setDeletePopup(false);
    if (responseData.error === false) {
      fetchShopAgent();
      customizeToast("success", "ລຶບຕົວແທນສຳເລັດ");
    } else {
      customizeToast("error", responseData.message);
    }
  };

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ລາຍການຕົວແທນ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title">
        <Row>
          <Col sm="4">
            <Form.Group className="mb-4">
              <Form.Label>ຄົ້ນຫາຊື່ຮ້ານ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ປ້ອນຊື່ຮ້ານ..."
                onChange={(e) => {
                  setShopName(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-4">
              <Form.Label>ເບີໂທຮ້ານ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ປ້ອນເບີໂທຮ້ານ..."
                onChange={(e) => {
                  setShopPhone(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-4">
              <Form.Label>ລະຫັດຮ້ານ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ປ້ອນລະຫັດຮ້ານ..."
                onChange={(e) => {
                  setShopCode(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary">
            {/* <b>ພະນັກງານ ({totals})</b> */}
            <b>ຕົວແທນ ({shopAgentList?.length})</b>
          </h4>

          <button
            className="btn-primary-web"
            onClick={() => {
              history.push("/add-agent");
            }}
          >
            + ເພີ່ມຕົວແທນ
          </button>
        </div>

        <div className="margin-top">
          {isLoading ? (
            <div className="loading-page">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : !isMobile ? (
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດ</th>
                  <th>ຊື່ຮ້ານ</th>
                  <th>ເຈົ້າຂອງຮ້ານ</th>
                  <th>ເບີໂທ</th>
                  <th>ວັນທີສ້າງ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              {shopAgentList?.map((item, index) => {
                return (
                  <tbody>
                    <tr key={item?._id} style={{ cursor: "pointer" }}>
                      {/* <td>{index + 1 + _limit * (_skip - 1)}</td> */}
                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.userCode}{" "}
                      </td>
                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopName}
                      </td>
                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.firstName} {item?.shopOwner?.lastName}
                      </td>

                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.phone}{" "}
                      </td>

                      <td
                        onClick={() => {
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {dateTimeLao(item?.createdAt)}
                      </td>

                      <td>
                        <button
                          style={{ color: "var(--main-color)", background: "none", border: "none" }}
                          onClick={(e) => {
                            setDeleteAgentId(item?._id);
                            setDeletePopup(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />{" "}
                        </button>
                      </td>
                    </tr>
                    {/* {Pagination_helper(totals, Routs.USER_LIST)} */}
                  </tbody>
                );
              })}
            </Table>
          ) : (
            <div className="flexCenter" style={{ flexDirection: "column", gap: 10 }}>
              {shopAgentList?.map((item, index) => (
                <div
                  className="flexBetween"
                  style={{ padding: 10, width: "100%", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}
                >
                  <div
                    style={{ flex: 1 }}
                    onClick={() => {
                      //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                      history.push(AGENT_DETAIL + "/" + item?._id);
                    }}
                  >
                    <h3>{item?.shopName}</h3>
                    <p style={{ margin: 0 }}>
                      {item?.shopOwner?.firstName} {item?.shopOwner?.lastName}
                    </p>
                    <small>
                      {item?.shopOwner?.phone} | {dateTimeLao(item?.createdAt)}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn-list-delete"
                      onClick={(e) => {
                        setDeleteAgentId(item?._id);
                        setDeletePopup(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />{" "}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal centered show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນລຶບຕົວແທນ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flexCenter" style={{ flexDirection: "column", gap: 10 }}>
          <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>ຕ້ອງການລຶບຕົວແທນນີ້ ຫຼື ບໍ່!</h1>
          <img src="/assets/image/alert-image.svg" alt="alert" style={{ width: "80%" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletePopup(false)}>
            ຍົກເລີກ
          </Button>
          <Button className="bg-primary" onClick={() => _handleDeleteAgent()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
