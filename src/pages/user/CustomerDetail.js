import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Row, Col, Modal, Button, Spinner, Table, Form } from 'react-bootstrap';
import Constant from '../../consts/index'
import Routs from '../../consts/router'

import { GET_USER } from '../../apollo/user/Query';
import { GET_ORDER_BILLS } from "../../apollo/bill/Query"
import { DELETE_USER } from '../../apollo/user/Mutation';

import { customizeToast } from '../../helper/toast';
import { formatDateDashDDMMYY } from '../../common';
import { convertRole, dateTimeLao } from '../../helper';
import { currencyFormat, formatDateDash } from "../../consts/function";


export default function UserDetail() {
    const history = useHistory();
    var endDate = formatDateDash(new Date());
    var startDate = moment("2023-05-01").format("YYYY-MM-DD");
    const location = useLocation();
    const match = useRouteMatch();
    const [dataUser, setDataUser] = useState();
    const [show, setShow] = useState(false);
    const [dataBills, setDataBills] = useState([]);
    const [createdAtEndSearch, setCreatedAtEndSearch] = useState(endDate);
    const [createdAtStartSearch, setCreatedAtStartSearch] = useState(startDate);

    const [loadDataUsers, { data: apolloDaaUsers, loading }] = useLazyQuery(GET_USER);
    const [loadOrderBills, { data: apolloOrderBills }] = useLazyQuery(GET_ORDER_BILLS, { fetchPolicy: "network-only" });
    const [deleteDataUser] = useMutation(DELETE_USER);
    useEffect(() => {
        loadOrderBills({
            variables: {
                where: { customer: match?.params?.id }
            }
        });
        loadDataUsers({ variables: { where: { id: match?.params?.id } } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match?.params?.id])

    useEffect(() => {
        if (apolloDaaUsers) setDataUser(apolloDaaUsers?.user)
        if (apolloOrderBills) setDataBills(apolloOrderBills?.OrderBills?.data)
    }, [apolloDaaUsers, apolloOrderBills])

    useEffect(() => {
        loadOrderBills({
            variables: {
                where: {
                    customer: match?.params?.id,
                    // startDate: createdAtStartSearch,
                    // endDate: createdAtEndSearch
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdAtStartSearch, createdAtEndSearch])

    const _updateUsers = (id) => history.push(Routs.USER_EDIT + "/" + id);
    const _deleteUser = () => { setShow(true); }
    const _confirmDeleteUser = () => {
        try {
            deleteDataUser({ variables: { where: { id: match?.params?.id } } });
            customizeToast("success", "ລຶບຜູ້ໃຊ້ລະບົບສຳເລັດ")
            if (location?.state?.role === 'staff') {
                history.push(Routs.USER_LIST + '/limit/30/skip/1')
            } else {
                history.push(Routs.CUSTOMER_LIST + '/limit/30/skip/1')
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        } catch (error) {
            customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
        }
        setShow(false);
    }
    const handleClose = () => setShow(false);

    if (loading) return <div className='customLoading'> <Spinner animation="border" variant="primary" /> </div>
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ຜູ້ໃຊ້ລະບົບ</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>ບຸນກອງນອງພະຈັນ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row>
                <Col sm="4">
                    <div className="card-add">
                        <div className="card-add-title">
                            <h4><b>ລາຍລະອຽດ</b></h4>
                        </div>
                        <hr />
                        <div className="card-add-body">
                            <Row>
                                <Col sm="12">
                                    <div className='image-detail'>
                                        {dataUser?.image ?
                                            <img src={Constant.URL_FOR_SHOW_PHOTO + dataUser?.image} alt="" className="box-upload-image" />
                                            : <img src="/assets/image/profile.png" className="box-upload-image" alt="" />}
                                    </div>
                                </Col>
                                <Col sm="12">
                                    <div style={{ marginTop: 25, marginBottom: 30 }}>
                                        <Row>
                                            <Col sm="6">ຊື່ ແລະ ນາມສະກຸນ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.fullName ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ເພດ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.gender ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ວັນເດືອນປີເກີດ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.birthday ? formatDateDashDDMMYY(dataUser?.birthday) : "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ແຂວງ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.province ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ເມືອງ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.district ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ບ້ານ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.village ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ເບີໂທ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.phone ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ສິດການນຳໃຊ້</Col>
                                            <Col sm="6" className="text-right">{dataUser?.role ? convertRole(dataUser?.role) : "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ບັນຊີເຂົ້າສູ່ລະບົບ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.userId ?? "-"}</Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6">ໝາຍເຫດ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.note ?? "-"}</Col>
                                        </Row>
                                        <br />
                                        <br />
                                        <br />
                                        <Row>
                                            <div>
                                                <button className="btn-edit" onClick={(e) => _updateUsers(dataUser?.id)}><FontAwesomeIcon icon={faEdit} /> ແກ້ໄຂ</button>
                                                <button className="btn-delete" onClick={(e) => _deleteUser(dataUser?.id)}><FontAwesomeIcon icon={faTrash} /> ລຶບ</button>
                                            </div>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col sm="8" style={{ marginLeft: -15 }}>
                    <div className="card-add">
                        <Row>
                            <Col sm="4">
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີສ້າງເລີມ</Form.Label>
                                    <Form.Control
                                        type="date"
                                        defaultValue={startDate}
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
                                        defaultValue={endDate}
                                        onChange={(e) => {
                                            setCreatedAtEndSearch(e.target.value);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="2" className='highlight'>
                                <span>ຈຳນວນບໍລິການ: </span><br /><h3>{currencyFormat(apolloOrderBills?.OrderBills?.total)}</h3></Col>
                            <Col sm="4" className='highlight'>
                                <span>ເປັນເງີນທັງໝົດ: </span> <br /> <h3>{currencyFormat(apolloOrderBills?.OrderBills?.finalAmount)} LAK</h3></Col>
                        </Row>
                        <br />
                        <Table striped>
                            <tr>
                                <th>ລຳດັບ</th>
                                <th>ຊື່ບໍລິການ</th>
                                <th>ຊ່າງ</th>
                                <th>ລາຄາ</th>
                                <th>ວັນເວລາ</th>
                            </tr>
                            {dataBills?.map((item, inx) => {
                                return (
                                    <tr>
                                        <td>{inx + 1}</td>
                                        <td>{item?.serviceName}</td>
                                        <td>{item?.staff?.fullName}</td>
                                        <td>{currencyFormat(item?.serviceId?.amount)}</td>
                                        <td>{dateTimeLao(item?.updatedAt)}</td>
                                    </tr>
                                )
                            })}
                        </Table>
                    </div>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ຢືນຢັນລຶບຜູ້ໃຊ້ລະບົບ</Modal.Title>
                </Modal.Header>
                <Modal.Body>ຕ້ອງການລຶບຜູ້ໃຊ້ລະບົບນີ້ ຫຼື ບໍ່!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ຍົກເລີກ
                    </Button>
                    <Button className='bg-primary' onClick={() => _confirmDeleteUser()}>
                        ຢືນຢັນ
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
