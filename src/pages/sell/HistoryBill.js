import React, { useEffect, useState } from 'react'

import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import moment from 'moment';
import { Breadcrumb, Row, Col, Table, Form } from "react-bootstrap";

import { currency, dateTimeLao } from "../../helper/index";
import { GET_ORDER_BILLS } from "../../apollo/bill/Query"
import { currencyFormat } from "../../consts/function";
import { GET_USERS } from '../../apollo/user/Query';
import PaginationHelper from '../../helper/PaginationHelper';
import Route from "../../consts/router";

export default function HistoryBill() {
    const location = useLocation();
    const parsed = queryString?.parse(location?.state);
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const [dataBills, setDataBills] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [total, setTotal] = useState(0);
    const [staff, setStaff] = useState(parsed?.staff ? parsed?.staff : '');
    const [billNumber, setBillNumber] = useState(parsed?.billNumber ? parsed?.billNumber : '');
    const [startDate, setStartDate] = useState(parsed?.startDate ? parsed?.startDate : moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(parsed?.endDate ? parsed?.endDate : moment(moment()).format("YYYY-MM-DD"));

    const [loadBills, { data: apolloBills }] = useLazyQuery(GET_ORDER_BILLS, { fetchPolicy: "network-only" });
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
        if (endDate !== "") _where = { ..._where, endDate: endDate };

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
            setDataBills(apolloBills?.OrderBills?.data)
            setTotal(apolloBills?.OrderBills?.total)
        }
    }, [apolloBills])
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>
                        ລາຍການບິນ
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
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
                    <Col md='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ຄົ້ນຫາຕາມເບີລູກຄ້າ</Form.Label>
                            <Form.Control type="text" placeholder="ຄົ້ນຫາຕາມເບີລູກຄ້າ" onChange={(e) => setBillNumber(e.target.value)} defaultValue={billNumber} />
                        </Form.Group>
                    </Col>
                </Row>

            </div>
            <div className='card-body'>
                <div className="card-body-title">
                    <h4 className="text-primary"><b>ລາຍການບິນ ({currency(total)})</b></h4>
                </div>

                <Table striped className='mt-5'>
                    <tr>
                        <th style={{ width: 100 }}>ລຳດັບ</th>
                        <th>ເລກບິນ</th>
                        <th>ຊື່ບໍລິການ</th>
                        <th>ລາຄາ</th>
                        <th>ຊື່ລູກຄ້າ</th>
                        <th>ເບີໂທລູກຄ້າ</th>
                        <th>ພະນັກງານ</th>
                        <th>ວັນທີໃຊ້ບໍລິການ</th>
                    </tr>
                    {dataBills?.map((item, inx) => {
                        return (
                            <tr>
                                <td>{inx + 1}</td>
                                <td>{item?.billId?.numberTable}</td>
                                <td>{item?.serviceId?.name}</td>
                                <td>{currencyFormat(item?.serviceId?.amount)}</td>
                                <td>{item?.billId?.customer?.fullName}</td>
                                <td>{item?.billId?.customer?.phone}</td>
                                <td>{item?.staff?.fullName}</td>
                                <td>{dateTimeLao(item?.updatedAt)}</td>
                            </tr>
                        )
                    })}
                </Table>
                {Pagination_helper(total, Route.HISTORY_BILL, `staff=${staff}&&billNumber=${billNumber}&&startDate=${startDate}&&endDate=${endDate}`)}

            </div>
        </>
    )
}
