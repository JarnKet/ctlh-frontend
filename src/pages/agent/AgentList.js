import { useState, useEffect } from "react";
/**
 * @Library
 */
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Component
 */
import { Form, Col, Row, Table, Spinner, Modal, Button, Breadcrumb } from "react-bootstrap";
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * @CONSTANT
 */
import { customizeToast } from "../../helper/toast";

import { AGENT_DETAIL } from "../../consts/router";
import { dateTimeLao } from "../../helper";

export default function AgentList() {
  const GET_ALL_SHOP_AGENT = "http://localhost:8080/v1/api/shop-agent/";
  const [shopAgentList, setShopAgentList] = useState(null);
  const history = useHistory();
  const [deleteAgentId, setDeleteAgentId] = useState(null);

  // Event Trigger
  const [isLoading, setIsLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const fetchShopAgent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(GET_ALL_SHOP_AGENT);
      const responseData = await response.json();
      console.log(responseData.data.data);
      setShopAgentList(responseData.data.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShopAgent();
  }, []);

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
              <Form.Label>ຄົ້ນຫາຊື່ Agent</Form.Label>
              <Form.Control
                type="type"
                placeholder="ຊຶ່"
                onChange={(e) => {
                  // setDataSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-4">
              <Form.Label>ເບີໂທ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ຄົ້ນຫາດ້ວຍເບີໂທ"
                onChange={(e) => {
                  // setPhoneSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          {/* <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ສິດການໃຊ້</Form.Label>
              <Form.Select
                onChange={(e) => {
                  // setRoleSearch(e.target.value);
                }}
              >
                <option value="">ທັງໝົດ</option>
                <option value="ADMIN">ແອັດມິນ</option>
                <option value="STAFF_STOCK">ພະນັກງານສາງ</option>
                <option value="STAFF">ຊ່າງ</option>
                <option value="COUNTER">ພະນັກງານເຄົ້າເຕີ້</option>
              </Form.Select>
            </Form.Group>
          </Col> */}
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary">
            {/* <b>ພະນັກງານ ({totals})</b> */}
            <b>ຕົວແທນ ({shopAgentList?.length})</b>
          </h4>
          {/* {userLoginData?.role === "ADMIN" ? (
            <button className="btn-primary-web" onClick={() => _historyPush(Routs.USER_ADD)}>
              + ເພີ່ມຜູ້ໃຊ້
            </button>
          ) : (
            <></>
          )} */}

          <button
            className="btn-primary-web"
            onClick={() => {
              // _historyPush(Routs.USER_ADD);
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
          ) : (
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
                  {/* {userLoginData?.role === "ADMIN" ? <th>ຈັດການ</th> : <></>} */}
                </tr>
              </thead>
              {shopAgentList?.map((item, index) => {
                return (
                  <tbody>
                    <tr key={item?._id} style={{ cursor: "pointer" }}>
                      {/* <td>{index + 1 + _limit * (_skip - 1)}</td> */}
                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.userCode}{" "}
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="icon-copy"
                          onClick={(e) => {
                            // _selectCodeForCopy(e, item?.userId);
                          }}
                        />
                      </td>
                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopName}
                      </td>
                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.firstName} {item?.shopOwner?.lastName}
                      </td>

                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {item?.shopOwner?.phone}{" "}
                        {/* <FontAwesomeIcon
                          icon={faCopy}
                          className="icon-copy"
                          onClick={(e) => {
                            // _selectPhoneForCopy(e, item?.phone);
                          }}
                        /> */}
                      </td>
                      {/* <td>{convertRole(item?.role)}</td> */}

                      <td
                        onClick={() => {
                          //  _historyPush(Routs.USER_DETAIL + "/" + item?.id + "/limit/10/skip/1", { role: "staff" });
                          history.push(AGENT_DETAIL + "/" + item?._id);
                        }}
                      >
                        {/* {dateTimeLao(item?.updatedAt)} | {item?.createdBy?.fullName} */}
                        {dateTimeLao(item?.createdAt)}
                      </td>
                      {/* {userLoginData?.role === "ADMIN" ? (
                        <td>
                          <button className="btn-list-edit" onClick={(e) => {
                            // _updateUsers(e, item?.id);
                          }}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="btn-list-delete" onClick={(e) => {
                            // _deleteUser(e, item);
                          }}>
                            <FontAwesomeIcon icon={faTrash} />{" "}
                          </button>
                        </td>
                      ) : (
                        <></>
                      )} */}
                      <td>
                        {/* <button
                          className="btn-list-edit"
                          onClick={(e) => {
                            // _updateUsers(e, item?.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button> */}
                        <button
                          className="btn-list-delete"
                          onClick={(e) => {
                            setDeleteAgentId(item?._id);
                            setDeletePopup(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />{" "}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </Table>
          )}
          {/* {Pagination_helper(totals, Routs.USER_LIST)} */}
        </div>
      </div>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນລຶບຕົວແທນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການລຶບຕົວແທນນີ້ ຫຼື ບໍ່!</Modal.Body>
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
