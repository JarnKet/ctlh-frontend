import React from 'react'
import { useHistory } from "react-router-dom";

import { Breadcrumb, Row, Col, Form, Table } from 'react-bootstrap';
import Routs from "../../consts/router";

export default function HistoryBoilAlcohol() {
    const history = useHistory();

    const _historyPush = (context) => {
        history.push(context)
    }
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>ບຸນກອງນອງພະຈັນ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="tap-custom">
                <div className="tap-top-bar" onClick={() => history.push(Routs.MEMBER_DETAIL)}>ຂໍ້ມູນທົ່ວໄປ</div>
                <div className="tap-top-bar-active" onClick={() => history.push(Routs.HISTORY_BOIL_ALCOHOL)}>ຂໍ້ມູນທົ່ວໄປ</div>
            </div>
            <div className="card-add">
                <div className="card-add-title">
                    <h4><b>ປະຫວັດການຕົ້ມເຫຼົ້າ</b></h4>
                </div>
                <hr />
                <div className="card-add-body">
                    <div className="card-title">
                        <Row>
                            <Col sm='3'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີເລີ່ມມ່າເຂົ້າ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col sm='3'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ຫາວັນທີເລີ່ມມ່າເຂົ້າ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col sm='3'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີຕົ້ມເຫຼົ້າ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col sm='3'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ຫາວັນທີຕົ້ມເຫຼົ້າ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    <div className="margin-top">
                    <Table responsive="xl">
                        <thead>
                            <tr>
                                <th>ລຳດັບ</th>
                                <th>ຈຳນວນເຂົ້າ</th>
                                <th>ຈຳນວນແປ້ງ</th>
                                <th>ຈຳນວນເຫຼົ້າ</th>
                                <th>ວັນທີເລີ່ມມ່າເຂົ້າ</th>
                                <th>ວັນທີສຳເລັດມ່າເຂົ້າຕົວຈິງ</th>
                                <th>ວັນທີຕົ້ມເຫຼົ້້າ</th>
                                <th>ວັນທີສຳເລັດການຕົ້ມເຫຼົ້າ</th>
                                <th>ໄລຍະເວລາຕົ້ມ</th>
                                <th>ວັນທີສຳເລັດ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onClick={() => _historyPush(Routs.HISTORY_BOIL_ALCOHOL_DETAIL)}>
                                <td>1</td>
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <td key={index}>Table cell {index}</td>
                                ))}
                                </tr>
                        </tbody>
                    </Table>
                </div>
                </div>
            </div>
        </>
    )
}
