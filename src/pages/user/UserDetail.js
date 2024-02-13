import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faEdit, faTrash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Row, Col, Modal, Button, Spinner, Table, Form, Tabs, Tab } from 'react-bootstrap';
import Constant, { USER_KEY } from '../../consts/index'
import Routs from '../../consts/router'

import { GET_USER } from '../../apollo/user/Query';
import { GET_COMMISSION } from "../../apollo/bill/Query"
import { GET_ABSENTS_REJECT_PRICES } from "../entry-exit/apollo/query"
import { DELETE_USER, UPDATE_ALL_COMMISSION } from '../../apollo/user/Mutation';

import { customizeToast } from '../../helper/toast';
import { formatDateDashDDMMYY } from '../../common';
import { convertRole, currency, dateTimeLao, convertGender } from '../../helper';
import { currencyFormat, formatDateDash } from "../../consts/function";
import PaginationHelper from '../../helper/PaginationHelper';


export default function UserDetail() {
    const history = useHistory();
    // console.log('history: ', history);
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    var endDate = formatDateDash(new Date());
    var startDate = moment("2023-05-01").format("YYYY-MM-DD");
    const location = useLocation();
    const match = useRouteMatch();
    // console.log('match: ', match);
    const [dataUser, setDataUser] = useState();
    const [show, setShow] = useState(false);
    const [showUpdateAllCommission, setShowUpdateAllCommission] = useState(false);
    const [updateAllCommissionLoading, setUpdateAllCommissionLoading] = useState(false);
    const [dataBills, setDataBills] = useState([]);
    const [totals, setTotals] = useState(0);
    const [createdAtEndSearch, setCreatedAtEndSearch] = useState(endDate);
    const [createdAtStartSearch, setCreatedAtStartSearch] = useState(startDate);
    const [userLoginData, setUserLoginData] = useState('')

    const getDataFromLocal = async () => {
        try {
            const _resData = await localStorage.getItem(USER_KEY)
            const _localJson = JSON.parse(_resData)

            if (_localJson?.data) {
                setUserLoginData(_localJson?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataFromLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [loadDataUsers, { data: apolloDaaUsers, loading }] = useLazyQuery(GET_USER);
    const [loadDataAbsentsRejectPrice, { data: apolloAbsentsReject }] = useLazyQuery(GET_ABSENTS_REJECT_PRICES, { fetchPolicy: "network-only" });
    const [loadCommission, { data: apolloCommission }] = useLazyQuery(GET_COMMISSION, { fetchPolicy: "network-only" });
    const [deleteDataUser] = useMutation(DELETE_USER);
    const [updateAllCommission] = useMutation(UPDATE_ALL_COMMISSION);
    useEffect(() => {
        loadCommission({
            variables: {
                where: { staff: match?.params?.id },
                skip: (_skip - 1) * _limit,
                limit: _limit,
            }
        });
        loadDataUsers({ variables: { where: { id: match?.params?.id } } })
        loadDataAbsentsRejectPrice({
            variables: {
                where: { staff: match?.params?.id }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match?.params?.id])

    useEffect(() => {
        if (apolloDaaUsers) setDataUser(apolloDaaUsers?.user)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apolloDaaUsers])
    useEffect(() => {
        if (apolloCommission?.commission) {
            setDataBills(apolloCommission?.commission?.orderBill)
            setTotals(apolloCommission?.commission?.orderBillCount)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apolloCommission])

    useEffect(() => {
        loadCommission({
            variables: {
                where: {
                    staff: match?.params?.id,
                    startDate: createdAtStartSearch,
                    endDate: createdAtEndSearch
                },
                skip: (_skip - 1) * _limit,
                limit: _limit,
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdAtStartSearch, createdAtEndSearch])

    useEffect(() => {
        loadDataAbsentsRejectPrice({
            variables: {
                where: {
                    staff: match?.params?.id,
                    startDate: createdAtStartSearch,
                    endDate: createdAtEndSearch
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

    const onUpdateAllCommission = async () => {
        try {
            setUpdateAllCommissionLoading(true)
            const _updateAllCommission = await updateAllCommission({
                variables: {
                    where: {
                        staff: match?.params?.id,
                        startDate: createdAtStartSearch,
                        endDate: createdAtEndSearch,
                        isCalculatedSalary: false
                    }
                }
            })
            console.log("_updateAllCommission: ", _updateAllCommission)
            await loadCommission({
                variables: {
                    where: {
                        staff: match?.params?.id,
                        startDate: createdAtStartSearch,
                        endDate: createdAtEndSearch
                    },
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                }
            });
            setUpdateAllCommissionLoading(false)
            setShowUpdateAllCommission(false)
        } catch (error) {
            console.log(error)
            setUpdateAllCommissionLoading(false)
            setShowUpdateAllCommission(false)
        }
    }

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
                                            <Col sm="6" className="text-right">{convertGender(dataUser?.gender) ?? "-"}</Col>
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
                                            <Col sm="6">ເງິນເດືອນປະຈຸບັນ</Col>
                                            <Col sm="6" className="text-right">{dataUser?.salary ? currency(dataUser?.salary) : "-"}</Col>
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
                                        {userLoginData?.role === 'ADMIN' ?
                                            <Row>
                                                <div>
                                                    <button className="btn-edit" onClick={(e) => _updateUsers(dataUser?.id)}><FontAwesomeIcon icon={faEdit} /> ແກ້ໄຂ</button>
                                                    <button className="btn-delete" onClick={(e) => _deleteUser(dataUser?.id)}><FontAwesomeIcon icon={faTrash} /> ລຶບ</button>
                                                </div>
                                            </Row>
                                            : <></>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>

                <Col sm="8" style={{ marginLeft: -15 }}>
                    <div>
                        <Tabs
                            defaultActiveKey="home"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                            style={{ marginLeft: 19 }}
                        >
                            <Tab eventKey="home" title="ປະຫວັດໃຫ້ບໍລິການ">
                                <div className="card-add" style={{ marginTop: -45 }}>
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
                                            <span>ຈຳນວນບໍລິການ: </span><br /><h3>{currencyFormat(apolloCommission?.commission?.orderBillCount ?? 0)}</h3></Col>
                                        <Col sm="4" className='highlight-not-pay'>
                                            <span>ເງີນທີຍັງຄ້າງຈ່າຍທັງໝົດ: </span> <br /> <h3>{currencyFormat(apolloCommission?.commission?.summary ?? 0)} ກີບ</h3></Col>
                                        <Col sm="3" className='highlight-not-pay'>
                                            <span>ຄ່າຄອມທີຍັງຄ້າງຈ່າຍ:</span> <br /> <h3>{currencyFormat(parseInt(apolloCommission?.commission?.summaryPrice ? apolloCommission?.commission?.summaryPrice.toFixed(0) : 0))} ກີບ</h3>
                                        </Col>
                                        <Col sm="2">
                                            <button className="btn-edit" style={{ width: 150, height: 60 }} onClick={(e) => setShowUpdateAllCommission(true)}><FontAwesomeIcon icon={faCircleCheck} style={{ color: 'green' }} /> ຈ່າຍແລ້ວທັງໝົດ</button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>ລຳດັບ</th>
                                                <th>ຊື່ບໍລິການ</th>
                                                <th>ລາຄາ</th>
                                                <th>ເລກບິນ</th>
                                                <th>ວັນເວລາ</th>
                                                <th>ສະຖານະ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataBills?.map((item, inx) => {
                                                return (
                                                    <tr key={inx}>
                                                        <td>{inx + 1 + _limit * (_skip - 1)}</td>
                                                        <td>{item?.serviceName} {item?.no ? `(ຄັ້ງທີ ${item?.no}/${item?.courseQty ?? item?.no})` : ""}</td>
                                                        <td>{(item?.no && item?.no > 1) ? currencyFormat(item?.coursePrice) : currencyFormat(item?.amount)}</td>
                                                        <td>{item?.billNumber}</td>
                                                        <td>{dateTimeLao(item?.updatedAt)}</td>
                                                        <td style={{ color: item?.isCalculatedSalary === true ? "green" : "orange" }}><FontAwesomeIcon icon={item?.isCalculatedSalary === true ? faCircleCheck : faTriangleExclamation} style={{ color: item?.isCalculatedSalary === true ? 'green' : 'orange' }} /> {item?.isCalculatedSalary === true ? "ຈ່າຍແລ້ວ" : "ຍັງບໍ່ຈ່າຍ"}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {Pagination_helper(totals, Routs.USER_DETAIL + "/" + match?.params?.id)}

                                </div>
                            </Tab>
                            <Tab eventKey="profile" title="ຕັດເງີນຕາມມື້ຂາດ">
                                <div className="card-add" style={{ marginTop: -45 }}>
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
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>ລຳດັບ</th>
                                                <th>ສະຖານະ</th>
                                                <th>ລາຄາ</th>
                                                <th>ລາຍລະອ</th>
                                                <th>ວັນເວລາ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {apolloAbsentsReject?.absentRejectPrices?.data?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.status}</td>
                                                        <td>{currencyFormat(item?.price)}</td>
                                                        <td>{item?.detail}</td>
                                                        <td>{dateTimeLao(item?.updatedAt)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {/* {Pagination_helper(totals, Routs.USER_LIST)} */}

                                </div>
                            </Tab>
                        </Tabs>
                    </div>

                </Col>
            </Row>
            <Modal show={showUpdateAllCommission} onHide={() => setShowUpdateAllCommission(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ຢືນຢັນການຈ່າຍຄ່າຄອມ</Modal.Title>
                </Modal.Header>
                <Modal.Body>ທ່ານຕ້ອງການຢືນຢັນການຈ່າຍຄ່າຄອມທັງໝົດນີ້ ຫຼື ບໍ່?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateAllCommission(false)}>
                        ຍົກເລີກ
                    </Button>
                    <Button className='bg-primary' onClick={() => onUpdateAllCommission()}>
                        {updateAllCommissionLoading && <Spinner animation="border" variant="light" size="sm" />}{" "} ຢືນຢັນ
                    </Button>
                </Modal.Footer>
            </Modal>
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
