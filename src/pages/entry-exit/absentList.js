
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Col, Row, Breadcrumb, Table, Spinner, Button, Modal } from 'react-bootstrap';
import { faCircleCheck, faCircleXmark, faCopy } from "@fortawesome/free-solid-svg-icons";
import Routs from "../../consts/router";
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';
import { GET_ABSENTS } from './apollo/query';
import { UPDATE_ABSENTS } from './apollo/mutation';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AbsentList() {
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const [absentData, setAbsentData] = useState([]);
    const [totals, setTotals] = useState("");
    const [dataSearch, setDataSearch] = useState("");
    const [isShowModal, setIsShowModal] = useState(false)
    const [dataDetail, setDataDetail] = useState({})
    const [startDateSearch, setStartDateSearch] = useState(moment(moment().add(-30, "days")).format("yyyy-MM-DD"));
    const [endDateSearch, setEndDateSearch] = useState(moment().format("yyyy-MM-DD"));
    const [isLoading, setIsLoading] = useState(false);
    const [absents, { data: apolloDataAbsents }] = useLazyQuery(GET_ABSENTS, { fetchPolicy: "network-only" });
    const [updateAbsents] = useMutation(UPDATE_ABSENTS);
    useEffect(() => {
        fetchAbsentData()
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchAbsentData()
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSearch, startDateSearch, endDateSearch]);

    useEffect(() => {
        if (apolloDataAbsents) {
            setAbsentData(apolloDataAbsents?.absents?.data);
            setTotals(apolloDataAbsents?.absents?.total);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apolloDataAbsents]);

    const fetchAbsentData = async () => {
        try {
            setIsLoading(true)
            let where = {}
            if (dataSearch) where = { ...where, note: dataSearch }
            if (startDateSearch) where = { ...where, startTimeStart: moment(startDateSearch).format("yyyy-MM-DD") }
            if (endDateSearch) where = { ...where, startTimeEnd: moment(endDateSearch).format("yyyy-MM-DD") }
            await absents({
                variables: {
                    where,
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                }
            });
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    const _selectCodeForCopy = (e, code) => {
        e.stopPropagation()
        customizeToast("success", "ຄັດລອກລະຫັດພະນັກງານແລ້ວ")
        navigator.clipboard.writeText(code)
    }

    const convertStatus = (status) => {
        let returnStatus = "ລໍຖ້າອະນຸມັດ"
        switch (status) {
            case "APPROVED":
                returnStatus = "ອະນຸມັດແລ້ວ"
                break;
            case "REJECTED":
                returnStatus = "ປະຕິເສດແລ້ວ"
                break;

            default:
                break;
        }
        return returnStatus
    }

    const _updateStatusApproved = async (e, ID) => {
        e.stopPropagation(e)
        try {
            await updateAbsents({
                variables: {
                    where: { id: ID },
                    data: { status: "APPROVED" }
                }
            })
            absents({
                variables: {
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                }
            });
            customizeToast("success", "ອັບເດດອະນຸມັດສຳເລັດ")
        } catch (err) {
            customizeToast("error", "ອັບເດດບໍ່ສຳເລັດກາລຸນາກວດຄືນ!")
            console.log("err: ", err)
        }
    }

    const _updateStatusReject = async (e, ID) => {
        e.stopPropagation(e)
        try {
            await updateAbsents({
                variables: {
                    where: { id: ID },
                    data: { status: "REJECTED" }
                }
            })
            absents({
                variables: { skip: (_skip - 1) * _limit, limit: _limit, }
            });
            customizeToast("success", "ອັບເດດປະຕິເສດສຳເລັດ")
        } catch (err) {
            customizeToast("error", "ອັບເດດບໍ່ສຳເລັດກາລຸນາກວດຄືນ!")
            console.log("err: ", err)
        }
    }

    return (
        <div className="body">
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>ລາຍການຂອບພັກວຽກ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-title" style={{ marginTop: 10 }}>
                <Row>
                    <Col sm='6'>
                        <Form.Group className="mb-3">
                            <Form.Label>ຄົ້ນຫາ</Form.Label>
                            <Form.Control type="type" placeholder="ລະຫັດພະນັກງານ" onChange={(e) => { setDataSearch(e.target.value) }} />
                        </Form.Group>
                    </Col>
                    <Col sm='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ວັນທີຂາດ</Form.Label>
                            <Form.Control type="date" value={startDateSearch} onChange={(e) => setStartDateSearch(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col sm='3'>
                        <Form.Group className="mb-3">
                            <Form.Label>ຫາວັນທີ</Form.Label>
                            <Form.Control type="date" value={endDateSearch} onChange={(e) => setEndDateSearch(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            <div className="card-body">
                <div className="card-body-title">
                    <h4 className="text-primary"><b>ການຂອບພັກວຽກ ({totals})</b></h4>
                </div>
                <div className="margin-top">
                    {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
                        <Table responsive="xl">
                            <thead>
                                <tr>
                                    <th>ລຳດັບ</th>
                                    <th>ລະຫັດພະນັກງານ</th>
                                    <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                                    <th>ເບີໂທ</th>
                                    <th>ວັນເວລາ</th>
                                    <th>ມື້ຂອບ</th>
                                    <th>ສະຖານະ</th>
                                    <th>ກວດສອບ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {absentData?.map((item, index) => {
                                    return (
                                        <tr key={index} onClick={() => { setIsShowModal(true); setDataDetail(item) }}>
                                            <td>{index + 1 + _limit * (_skip - 1)}</td>
                                            <td>{item?.userId?.userId ?? "-"} <FontAwesomeIcon icon={faCopy} className="icon-copy" style={{ color: "#1e81fa" }} onClick={(e) => _selectCodeForCopy(e, item?.userId?.userId)} /></td>
                                            <td>{item?.userId?.fullName ?? "-"}</td>
                                            <td>{item?.userId?.phone ?? "-"}</td>
                                            <td>{moment(moment(item?.startTime).add(-7, "hours")).format("DD/MM/yyyy HH:mm")} ຫາ {moment(moment(item?.endTime).add(-7, "hours")).format("DD/MM/yyyy HH:mm")}</td>
                                            <td>{moment(item?.createdAt).format("DD/MM/yyyy HH:mm")}</td>
                                            <td style={{ color: item?.status === "APPROVED" ? "#0bb337" : (item?.status === "REJECTED" ? "#d40808" : "#000") }}>{item?.status ? convertStatus(item?.status) : "-"}</td>
                                            
                                            <td>
                                                {item?.status === "REQUESTING" ?
                                                <div>
                                                <Button onClick={(e) => _updateStatusApproved(e, item?.id)}><FontAwesomeIcon icon={faCircleCheck} />&nbsp;ອະນຸມັດ</Button>
                                                &nbsp;&nbsp;&nbsp;
                                                <Button onClick={(e) => _updateStatusReject(e, item?.id)} variant="outline-danger"><FontAwesomeIcon icon={faCircleXmark} />&nbsp;ປະຕິເສດ</Button>
                                                </div>
                                                : "" }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>}
                    {Pagination_helper(totals, Routs.ENTRY_EXIT_LIST)}
                </div>
            </div>
            <Modal show={isShowModal} onHide={() => setIsShowModal(false)}>
                <Modal.Header closeButton>
                    <h3>ລາຍລະອຽດ</h3>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ຊື່ ແລະ ນາມສະກຸນ:</Form.Label>
                        <Form.Control type="text" readOnly className='bg-white' value={dataDetail && dataDetail?.userId?.fullName} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>ເຫດຜົນ:</Form.Label>
                        <Form.Control as='textarea' rows={6} readOnly className='bg-white' value={dataDetail && dataDetail?.description} />
                    </Form.Group>
                </Modal.Body>
            </Modal>
        </div>
    )
}
