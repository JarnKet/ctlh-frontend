import React, { useEffect, useState } from 'react'

import { useLazyQuery, useMutation } from "@apollo/client";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import queryString from 'query-string';
import moment from 'moment';
import { Breadcrumb, Row, Col, Table, Form, Modal, Button } from "react-bootstrap";

import { currency, dateTimeLao } from "../../helper/index";
import { GET_BILLS } from "../../apollo/bill/Query"
import { ConcertPayMethod, currencyFormat } from "../../consts/function";
import { GET_USERS } from '../../apollo/user/Query';
import PaginationHelper from '../../helper/PaginationHelper';
import Route, { INCOME_DETAIL } from "../../consts/router";
import Navbar from "./Navbar";
import { customizeToast } from '../../helper/toast';
import { DELETE_BILL } from '../../apollo/bill/Mutation';


export default function Income() {
    const location = useLocation();
    const history = useHistory();
    var dateNow = moment(new Date()).format("YYYY-MM-DD");
    const parsed = queryString?.parse(location?.state);
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const [dataSelect, setDataSelect] = useState({});
    const [dataBills, setDataBills] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [total, setTotal] = useState(0);
    const [staff, setStaff] = useState(parsed?.staff ? parsed?.staff : '');
    const [billNumber, setBillNumber] = useState(parsed?.billNumber ? parsed?.billNumber : '');
    const [startDate, setStartDate] = useState(parsed?.startDate ? parsed?.startDate : dateNow);
    const [endDate, setEndDate] = useState(parsed?.endDate ? parsed?.endDate : dateNow);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // const [startDate, setStartDate] = useState(parsed?.startDate ? parsed?.startDate : moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    // const [endDate, setEndDate] = useState(parsed?.endDate ? parsed?.endDate : moment(moment()).format("YYYY-MM-DD"));

    const [deleteBillResolver] = useMutation(DELETE_BILL);
    const [loadBills, { data: apolloBills }] = useLazyQuery(GET_BILLS, { fetchPolicy: "network-only" });
    const [loadDataUsers, { data: apolloDaaUsers }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });

    useEffect(() => {
        loadDataUsers({ variables: { where: { role: "STAFF" } } })
        loadBills({
            variables: {
                where: { status: "CHECK_OUT" },
                skip: (_skip - 1) * _limit,
                limit: _limit,
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (apolloDaaUsers) { setUsersData(apolloDaaUsers?.users?.data); }
    }, [apolloDaaUsers]);

    useEffect(() => {
        let _where = { status: "CHECK_OUT" }
        if (billNumber !== "") _where = { ..._where, billNumber: billNumber };
        if (staff !== "") _where = { ..._where, staff: staff };
        if (startDate !== "") _where = { ..._where, startDate: startDate };
        if (endDate !== "") _where = { ..._where, endDate: moment(moment(endDate).add(1, "day")).format("YYYY-MM-DD") };

        loadBills({
            variables: {
                where: _where,
                skip: (_skip - 1) * _limit,
                limit: _limit,
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billNumber, staff, startDate, endDate]);

    useEffect(() => {
        if (apolloBills) {
            setDataBills(apolloBills?.bills?.data)
            setTotal(apolloBills?.bills?.total)
        }
    }, [apolloBills])
    // =========> delete bill ====> 
    const _deleteBill = async () => {
        try {
            const _delete = await deleteBillResolver({ variables: { where: { id: dataSelect.id } } });
            if (_delete?.data) {
                handleClose()
                customizeToast("success", "ລຶບ Bill ສຳເລັດ")
                loadBills({
                    variables: {
                        where: { status: "CHECK_OUT" },
                        skip: (_skip - 1) * _limit,
                        limit: _limit,
                    }
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        } catch (error) {
            customizeToast("error", "ການລົບ Bill ບໍ່ສຳເລັດກະລຸນາລອງໃຫ່ມພາຍຫຼັງ!")
        }
    }

    const _selectPhoneForCopy = (e, data) => {
        e.stopPropagation()
        setDataSelect(data)
        handleShow()
    }
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>
                        ລາຍການບິນ
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Navbar />
            <div className="card-title">
                <Row>
                    <Col md='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ເລກບິນ</Form.Label>
                            <Form.Control type="text" placeholder="ຄົ້ນຫາເລກບິນ" onChange={(e) => setBillNumber(e.target.value)} defaultValue={billNumber} />
                        </Form.Group>
                    </Col>
                    <Col md='3'>
                        <Form.Group>
                            <Form.Label>ພະນັກງານ</Form.Label>
                            <Form.Control as="select" className='form-select' onChange={(e) => setStaff(e.target.value)} value={staff} >
                                <option value="">ທັງໝົດ</option>
                                {usersData?.map((user, index) =>
                                    <option key={index} value={user?.id}>{user?.fullName}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ວັນທີ</Form.Label>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ຫາວັນທີ</Form.Label>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    {/* <Col md='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ເບີໂທລູກຄ້າ</Form.Label>
                            <Form.Control type="text" placeholder="ເບີໂທລູກຄ້າ" onChange={(e) => setPhoneNumber(e.target.value)} defaultValue={phoneNumber} />
                        </Form.Group>
                    </Col> */}
                </Row>
            </div>
            <div className='card-body'>
                <div className="card-body-title">
                    <h4 className="text-primary"><b>ລາຍການບິນ ({currency(total)})</b></h4>
                </div>

                <Table striped className='mt-5'>
                    <thead>
                        <tr>
                            <th style={{ width: 100 }}>ລຳດັບ</th>
                            <th>ເລກບິນ</th>
                            <th>ລາຄາ</th>
                            <th>tip</th>
                            <th>ໂປຣໂມຊັ່ນ</th>
                            <th>ອ.ມ.ພ</th>
                            <th>ເງິນສ່ວນຫຼຸດ</th>
                            <th>ເງິນທີ່ລູກຄ້າຈ່າຍ</th>
                            <th>ສະກຸນເງິນ</th>
                            <th>ຊື່ລູກຄ້າ</th>
                            <th>ເບີໂທລູກຄ້າ</th>
                            <th>ວັນທີໃຊ້ບໍລິການ</th>
                            <th>ຈັດການ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataBills?.map((item, inx) => {
                            return (
                                <tr onClick={() => history.push(INCOME_DETAIL + '/' + item?.id, item)}>
                                    <td>{inx + 1}</td>
                                    <td>{item?.numberTable}</td>
                                    <td>{currencyFormat(item?.amount)}</td>
                                    <td>
                                        <div>{currencyFormat(item?.tipCash)} ສົດ</div>
                                        <div>{currencyFormat(item?.tipOnline)} ໂອນ</div>
                                    </td>
                                    <td>{currencyFormat(item?.promotionAmount)}</td>
                                    <td>{currencyFormat(item?.dutyAmount)}</td>
                                    <td>{currencyFormat(item?.discount)}</td>
                                    <td>{currencyFormat(item?.finalAmount)}</td>
                                    <td>{ConcertPayMethod(item?.paymentMethod)}</td>
                                    <td>{item?.customer?.fullName ? item?.customer?.fullName : '-'}</td>
                                    <td>{item?.customer?.phone ? item?.customer?.phone : '-'}</td>
                                    <td>{dateTimeLao(item?.updatedAt)}</td>
                                    <td>
                                        <button className='btn-list-delete'
                                            onClick={(e) => _selectPhoneForCopy(e, item)}
                                        ><FontAwesomeIcon icon={faTrash} /> </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {/* <tr>
                            <td colSpan={6}>ລວມ :</td>
                            <td colSpan={5}>{currencyFormat(apolloBills?.bills?.finalAmount)}</td>
                        </tr> */}
                    </tbody>
                </Table>
                {Pagination_helper(total, Route.INCOME_LIST, `staff=${staff}&&billNumber=${billNumber}&&startDate=${startDate}&&endDate=${endDate}`)}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>ລົບ Bill</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ justifyContent: "center",display:"flex" }}>
                            <div>ທ່ານຕ້ອງການລົບ bill </div>
                            <div style={{color:"red",paddingLeft:10,paddingRight:10}}>{dataSelect?.numberTable} </div>
                            <div>ນີ້ແທ້ບໍ ? </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            ຍົກເລີກ
                        </Button>
                        <Button variant="primary" onClick={() => _deleteBill()}>
                            ລົບ
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
