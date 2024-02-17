import React from 'react'
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Form, Col, Row, Breadcrumb, Table } from 'react-bootstrap';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import Routs from "../../consts/router";
export default function RecordReceiptOfGoodsFromMembers() {
    const history = useHistory();
    const _historyPush = (context) => {
        history.push(context)
    }
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row>
                <Col sm="6">
                    <div className="tap-custom">
                        <div className="tap-top-bar" onClick={() => history.push(Routs.RAW_MATERIALS_OUTPUT)}>ວັດຖຸດິບອອກ</div>
                        <div className="tap-top-bar" onClick={() => history.push(Routs.SUPPLY_GOODS_LISTS)}>ວັດຖຸດິບເຂົ້າ</div>
                        {/* <div className="tap-top-bar-active" onClick={() => history.push(Routs.RECORD_RECEIPT_OF_GOODS_FROM_MEMBERS)}>ບັນທຶກຮັບສິນຄ້າ</div> */}
                    </div>
                    <div className="card-title">
                        <Row>
                            <Col sm='6'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີເພີ່ມຕັ້ງແຕ່</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col sm='6'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີເພີ່ມເຖິງ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>ປະເພດສິຄ້າ</Form.Label>
                            <Form.Select >
                                <option>ກະລຸນາເລືອກ</option>
                                <option>Disabled select</option>
                                <option>Disabled select</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </Col>
                <Col sm="6">
                    <div className="card-title-custom item-center">
                            <Col sm="7">
                                <div className="card-supply-goods">
                                    <Row>
                                        <Col sm="3">
                                            <img src="/assets/image/liquor.png" alt='' width="50px" height="50px" />
                                        </Col>
                                        <Col sm="9" className='font-size-32 text-bold-700'>1000 ກ.ກ</Col>
                                        <Col sm="12" className="spgl-padding font-size-14">ຈຳນວນເຫຼົ້້າທີ່ບັນທືກໄດ້</Col>
                                    </Row>
                                </div>
                            </Col>
                    </div>
                </Col>
            </Row>
            <div className="card-body">
                <div className="card-body-title">
                    <div className="card-body-btn-type">
                        <button>ຈຳນວນເຂົ້າໝົດ</button>
                        <button>ຈຳນວນແປ້ງໝົດ</button>
                    </div>
                    <button className="btn-primary-web" onClick={() => _historyPush(Routs.MEMBER_ADD)}>ຮັບສິນຄ້າ</button>
                </div>
                <h4 className="text-primary"><b>ສະມາຊິກຕົ້ມເຫຼົ້າທັງໝົດ 90  ຄົນ</b></h4>
                <div className="margin-top">
                    <Table responsive="xl">
                        <thead>
                            <tr>
                                <th>ລຳດັບ</th>
                                <th>ລະຫັດສະມາຊິກ</th>
                                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                                <th>ເຫຼົ້າທີ່ມາສົ່ງ</th>
                                <th>ວັນທີ່ເພີ່ມ</th>
                                <th>ວັນທີອັບເດດ</th>
                                <th>ຈັດການ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>1</td>
                                <td>SV13234</td>
                                <td>ສຸກສະຫວັນ</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>2</td>
                                <td>SV46524</td>
                                <td>ໜູ</td>
                                <td>500 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>3</td>
                                <td>SV48563</td>
                                <td>ແມັກກີ້</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>4</td>
                                <td>SV85434</td>
                                <td>ດວງ</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>5</td>
                                <td>SV86342</td>
                                <td>ຝົນ</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>6</td>
                                <td>SV95352</td>
                                <td>ສຸກສະຫວັນ</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                            <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL)}>
                                <td>7</td>
                                <td>SV13234</td>
                                <td>ນິ້ງ</td>
                                <td>200 ລ</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td>15/5/2022 21:06 ໂດຍ Soukthave</td>
                                <td> <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button><button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button> </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
