import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Form, Col, Row, Breadcrumb, Table, Modal, Spinner } from 'react-bootstrap';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { GET_USERS_FOR_DROPDOWN } from '../../apollo/user/Query';
import Routs from "../../consts/router";
import { useLazyQuery } from '@apollo/client';
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRODUCT_EXPORT, DELETE_PRODUCT_EXPORT, UPDATE_PRODUCT_EXPORT } from '../../apollo/product/Mutation';
import { PRODUCT_EXPORTS } from '../../apollo/product/Query';
import { customizeToast } from '../../helper/toast';
import moment from 'moment';
import PaginationHelper from '../../helper/PaginationHelper';
import {currency} from '../../helper/index';

export default function RawMaterialsOutput() {
    const history = useHistory();
    const { _limit, _skip, Pagination_helper } = PaginationHelper();

    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState("");

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [usersData, setUsersData] = useState([]);
    const [productExportsData, setProductExportsData] = useState([]);
    const [productExportsTotal, setProductExportsTotal] = useState(0);
    const [productExportsAmountRice, setProductExportsAmountRice] = useState(0);
    const [productExportsAmountFlour, setProductExportsAmountFlour] = useState(0);

    const [startDate, setStartDate] = useState(moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment(moment()).format("YYYY-MM-DD"));

    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [selectedMemberName, setSelectedMemberName] = useState("");
    const [amountRice, setAmountRice] = useState(0);
    const [amountFlour, setAmountFlour] = useState(0);
    const [amountCalculatedAlcohol, setAmountCalculatedAlcohol] = useState(0);
    const [amountDebtAlcohol, setAmountDebtAlcohol] = useState(0);
    const [amountImportedAlcohol, setAmountImportedAlcohol] = useState(0);
    const [detail, setDetail] = useState("");

    const [loading, setLoading] = useState(false);

    const [loadDataUsers, { data: apolloDaaUsers }] = useLazyQuery(GET_USERS_FOR_DROPDOWN, { fetchPolicy: "network-only" });
    const [loadDataProductExports, { data: apolloDataProductExport }] = useLazyQuery(PRODUCT_EXPORTS, { fetchPolicy: "network-only" });
    const [createProductExport] = useMutation(CREATE_PRODUCT_EXPORT);
    const [updateProductExport] = useMutation(UPDATE_PRODUCT_EXPORT);
    const [deleteProductExport] = useMutation(DELETE_PRODUCT_EXPORT);

    useEffect(() => {
        loadDataUsers({
            variables: {
                where: { role: "MEMBER" },
                skip: 0,
                limit: 1000,
            }
        });
        getProductExport()
    }, []);

    useEffect(() => {
        if (apolloDaaUsers) {
            setUsersData(apolloDaaUsers?.users?.data);
        }
    }, [apolloDaaUsers]);

    useEffect(() => {
        if (apolloDataProductExport) {
            setProductExportsData(apolloDataProductExport?.productExports?.data);
            setProductExportsTotal(apolloDataProductExport?.productExports?.total)
            setProductExportsAmountRice(apolloDataProductExport?.productExports?.sumAmountRice)
            setProductExportsAmountFlour(apolloDataProductExport?.productExports?.sumAmountFlour)
        }
    }, [apolloDataProductExport]);
    useEffect(() => {
        getProductExport()
    }, [startDate, endDate])

    const getProductExport = async () => {
        try {
            setLoading(true)
            let _where = {}
            if (startDate !== "") _where = { ..._where, createdAt_gte: startDate ?? "" };
            if (endDate !== "") _where = { ..._where, createdAt_lt: moment(moment(endDate).add(1, "days")).format("YYYY-MM-DD") ?? "" };
            await loadDataProductExports({
                variables: {
                    where: _where,
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                    orderBy: "createdAt_DESC",
                }
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const onSelectMember = (e) => {
        try {
            setSelectedMemberId(e.target.value)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const onCreateProductExport = async () => {
        try {
            setLoading(true)
            handleCloseAdd()
            await createProductExport({
                variables: {
                    data: {
                        member: selectedMemberId,
                        amountRice: parseFloat(amountRice),
                        amountFlour: parseFloat(amountFlour),
                        amountCalculatedAlcohol: parseFloat(amountCalculatedAlcohol),
                        amountDebtAlcohol: parseFloat(amountDebtAlcohol),
                        amountImportedAlcohol: parseFloat(amountImportedAlcohol),
                        detail: detail,
                    }
                }
            })
            customizeToast("success", "ເບີກວັດຖຸດິບສຳເລັດ!")
            getProductExport()
            setSelectedMemberId("")
            setAmountRice(0)
            setAmountFlour(0)
            setAmountCalculatedAlcohol(0)
            setAmountDebtAlcohol(0)
            setAmountImportedAlcohol(0)
            setDetail("")
            setLoading(false)
        } catch (error) {
            console.log("error: ", error)
            setLoading(false)
            customizeToast("error", "ເບີກວັດຖຸດິບບໍ່ສຳເລັດ!")
            handleCloseAdd()
        }
    }

    const updateProduct = (e, data) => {
        e.stopPropagation()
        setIsUpdate(true)
        setUpdateId(data.id)
        setSelectedMemberId(data.member.id)
        setAmountRice(data.amountRice)
        setAmountFlour(data.amountFlour)
        setAmountCalculatedAlcohol(data.amountCalculatedAlcohol)
        setAmountDebtAlcohol(data.amountDebtAlcohol)
        setAmountImportedAlcohol(data.amountImportedAlcohol)
        setDetail(data.detail)
        handleShowAdd()
    }

    const onUpdateProductExport = async () => {
        try {
            setLoading(true)
            handleCloseAdd()
            await updateProductExport({
                variables: {
                    data: {
                        member: selectedMemberId,
                        amountRice: parseFloat(amountRice),
                        amountFlour: parseFloat(amountFlour),
                        amountCalculatedAlcohol: parseFloat(amountCalculatedAlcohol),
                        amountDebtAlcohol: parseFloat(amountDebtAlcohol),
                        amountImportedAlcohol: parseFloat(amountImportedAlcohol),
                        detail: detail,
                    },
                    where: {
                        id: updateId
                    }
                }
            })
            getProductExport()
            customizeToast("success", "ແກ້ໄຂວັດຖຸດິບສຳເລັດ!")
            setUpdateId("")
            setSelectedMemberId("")
            setAmountRice(0)
            setAmountFlour(0)
            setAmountCalculatedAlcohol(0)
            setAmountDebtAlcohol(0)
            setAmountImportedAlcohol(0)
            setDetail("")
            setLoading(false)
            setIsUpdate(false)
        } catch (error) {
            console.log("error: ", error)
            setLoading(false)
            setIsUpdate(false)
            customizeToast("error", "ແກ້ໄຂວັດຖຸດິບບໍ່ສຳເລັດ!")
            handleCloseAdd()
        }
    }

    const deleteProduct = (e, data) => {
        e.stopPropagation()
        setUpdateId(data.id)
        setSelectedMemberName(data.member ? data.member.fullName : "-")
        handleShowDelete()
    }

    const onDeleteProductExport = async () => {
        try {
            setLoading(true)
            handleCloseDelete()
            await deleteProductExport({
                variables: {
                    where: {
                        id: updateId
                    }
                }
            })
            getProductExport()
            customizeToast("success", "ລົບວັດຖຸດິບສຳເລັດ!")
            setUpdateId("")
            setSelectedMemberName("")
            setLoading(false)
        } catch (error) {
            console.log("error: ", error)
            setLoading(false)
            customizeToast("error", "ລົບວັດຖຸດິບບໍ່ສຳເລັດ!")
            handleCloseDelete()
        }
    }

    const _selectQtyRao = (qty) => {
        setAmountRice(qty.target.value)
        var amountFlour = parseInt(qty.target.value) / 80;
        setAmountFlour(amountFlour);
        var amountCalculatedAlcohol = parseInt(qty.target.value) * 0.75;
        setAmountCalculatedAlcohol(amountCalculatedAlcohol);
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
                        <div className="tap-top-bar-active" onClick={() => history.push(Routs.RAW_MATERIALS_OUTPUT + `/limit/30/skip/1`)}>ວັດຖຸດິບອອກ</div>
                        <div className="tap-top-bar" onClick={() => history.push(Routs.SUPPLY_GOODS_LISTS + `/limit/30/skip/1`)}>ວັດຖຸດິບເຂົ້າ</div>
                        {/* <div className="tap-top-bar" onClick={() => history.push(Routs.RECORD_RECEIPT_OF_GOODS_FROM_MEMBERS)}>ບັນທຶກຮັບສິນຄ້າ</div> */}
                    </div>
                    <div className="card-title">
                        <Row>
                            <Col sm='6'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີເພີ່ມຕັ້ງແຕ່</Form.Label>
                                    <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col sm='6'>
                                <Form.Group className="mb-3">
                                    <Form.Label>ວັນທີເພີ່ມເຖິງ</Form.Label>
                                    <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Form.Group className="mb-3">
                            <Form.Label>ປະເພດສິນຄ້າ</Form.Label>
                            <Form.Select >
                                <option>ກະລຸນາເລືອກ</option>
                                <option>ເຂົ້າ</option>
                                <option>ແປ້ງ</option>
                            </Form.Select>
                        </Form.Group> */}
                    </div>
                </Col>
                <Col sm="6">
                    <div className="card-title-custom">
                        <Row>
                            <Col sm="6">
                                <div className="card-supply-goods">
                                    <Row>
                                        <Col sm="3">
                                            <img src="/assets/image/seed-bag.png" alt='' width="50px" height="50px" />
                                        </Col>
                                        <Col sm="9" className='font-size-32 text-bold-700'>{productExportsAmountRice} ກ.ກ</Col>
                                        <Col sm="12" className="spgl-padding font-size-14">ຈຳນວນເຂົ້າທັງໝົດ</Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="card-supply-goods">
                                    <Row>
                                        <Col sm="3">
                                            <img src="/assets/image/flour.png" alt='' width="50px" height="50px" />
                                        </Col>
                                        <Col sm="9" className='font-size-32 text-bold-700'>{productExportsAmountFlour} ກ.ກ</Col>
                                        <Col sm="12" className="spgl-padding font-size-14">ຈຳນວນແປ້ງທັງໝົດ</Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <div className="card-body">
                <div className="card-body-title">
                    <div className="card-body-btn-type">
                        {/* <button>ຈຳນວນເຂົ້າໝົດ</button>
                        <button>ຈຳນວນແປ້ງໝົດ</button> */}
                    </div>
                    <button className="btn-primary-web" onClick={handleShowAdd}>ເບິກວັດຖຸດິບ</button>
                </div>
                <h4 className="text-primary"><b>ສະມາຊິກຕົ້ມເຫຼົ້າທັງໝົດ {currency(productExportsTotal)}  ຄົນ</b></h4>
                <div className="margin-top">
                    {loading ? <Spinner animation="border" variant="primary" />
                        :
                        <Table responsive="xl">
                            <thead>
                                <tr>
                                    <th>ລຳດັບ</th>
                                    <th>ລະຫັດສະມາຊິກ</th>
                                    <th>ຊື່ສະມາຊິກ</th>
                                    <th>ເຂົ້າທີ່ເບິກໄປ</th>
                                    <th>ແປ້ງທີ່ເບິກໄປ</th>
                                    <th>ຈຳນວນເຫຼົ້າທີ່ຄິດໄລ່ໄດ້</th>
                                    <th>ຈຳນວນເຫຼົ້າທີ່ນຳເຂົ້າ</th>
                                    <th>ຈຳນວນເຫຼົ້າທີ່ຍັງຄ້າງ</th>
                                    <th>ວັນທີເບິກ</th>
                                    <th>ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productExportsData?.map((item, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.member?.code}</td>
                                        <td>{item?.member?.fullName}</td>
                                        <td>{currency(item?.amountRice)} ກ.ກ</td>
                                        <td>{currency(item?.amountFlour)} ກ.ກ</td>
                                        <td>{currency(item?.amountCalculatedAlcohol)} ລິດ</td>
                                        <td>{currency(item?.amountImportedAlcohol)} ລິດ</td>
                                        <td>{currency(item?.amountDebtAlcohol)} ລິດ</td>
                                        <td>{moment(item?.createdAt).format("YYYY-MM-DD, hh:mm")} ໂດຍ {item?.createdBy?.fullName}</td>
                                        <td>
                                            <button className='btn-list-edit' onClick={(e) => updateProduct(e, item)}><FontAwesomeIcon icon={faEdit} /></button>
                                            <button className='btn-list-delete' onClick={(e) => deleteProduct(e, item)}><FontAwesomeIcon icon={faTrash} /></button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>}
                </div>

                {Pagination_helper(productExportsTotal, Routs.RAW_MATERIALS_OUTPUT)}
            </div>
            <Modal
                show={showAdd}
                onHide={handleCloseAdd}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdate ? "ແກ້ໄຊວັດຖຸດິບ" : "ເບີກວັດຖຸດິບ"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>ສະມາຊິກ</Form.Label>
                        <Form.Select onChange={(e) => onSelectMember(e)} value={selectedMemberId}>
                            <option value="">ກະລຸນາເລືອກສະມາຊິກ</option>
                            {usersData?.map((item, index) =>
                                <option key={index} value={item?.id}>{item?.fullName ?? "-"}</option>
                            )}
                        </Form.Select>
                        <Form.Group>
                            <Form.Label>ຈຳນວນເຂົ້າ (ກ.ກ)</Form.Label>
                            <Form.Control as="select" placeholder="0" onChange={(e) => _selectQtyRao(e)} >
                                <option>ເລືອກຈຳນວນເຂົ້າ </option>
                                <option value='500'>500</option>
                                <option value='1000'>1000</option>
                                <option value='1500'>1500</option>
                                <option value='2000'>2000</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ຈຳນວນແປ້ງ (ກ.ກ)</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountFlour} onChange={(e) => setAmountFlour(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ຈຳນວນເຫຼົ້າທີ່ຄິດໄລ່ໄດ້</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountCalculatedAlcohol} />
                        </Form.Group>
                        {isUpdate && <Form.Group>
                            <Form.Label>ຈຳນວນເຫຼົ້າທີ່ນຳເຂົ້າ</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountImportedAlcohol} onChange={(e) => setAmountImportedAlcohol(e.target.value)} />
                        </Form.Group>}
                        {isUpdate && <Form.Group>
                            <Form.Label>ຈຳນວນເຫຼົ້າທີ່ຍັງຄ້າງ</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountDebtAlcohol} onChange={(e) => setAmountDebtAlcohol(e.target.value)} />
                        </Form.Group>}
                        <Form.Group>
                            <Form.Label>ໝາຍເຫດ</Form.Label>
                            <Form.Control as="textarea" placeholder="ກະລຸນນາເພີ່ມ" value={detail} onChange={(e) => setDetail(e.target.value)} />
                        </Form.Group>
                    </Form.Group>
                </Modal.Body>
                <div style={{ padding: 18 }}>
                    <button className="btn-primary-web" style={{ width: "100%" }} onClick={() => isUpdate ? onUpdateProductExport() : onCreateProductExport()}>ບັນທືກ</button>
                </div>
            </Modal>
            <Modal
                show={showDelete}
                onHide={handleCloseDelete}
            >
                <Modal.Header closeButton>
                    <Modal.Title>ລົບການເບີກວັດຖຸດິບ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>ທ່ານຕ້ອງການລົບການເບີກວັດຖຸດິບໃຫ້ກັບ {selectedMemberName ?? "-"} ແທ້ບໍ່?</p>
                </Modal.Body>
                <div style={{ padding: 18 }}>
                    <button className="btn-primary-web" style={{ width: "100%" }} onClick={() => onDeleteProductExport()}>ຢືນຢັນ</button>
                </div>
            </Modal>
        </>
    )
}
