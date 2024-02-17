import React, { useState, useEffect } from 'react'

import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Form, Col, Row, Breadcrumb, Table, Modal, Spinner } from 'react-bootstrap';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import Routs from "../../consts/router";
import { PRODUCT_EXPORTS, PRODUCT_IMPORTS } from '../../apollo/product/Query';
import { CREATE_PRODUCT_IMPORT, DELETE_PRODUCT_IMPORT } from '../../apollo/product/Mutation';
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';

export default function SupplyGoodsLists() {

    const history = useHistory();
    const [showAdd, setShowAdd] = useState(false);
    const [deleteId, setDeleteId] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const { _limit, _skip, Pagination_helper } = PaginationHelper();

    const [startDate, setStartDate] = useState(moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment(moment()).format("YYYY-MM-DD"));

    const [productImportsTotal, setProductImportsTotal] = useState(0);
    const [productImportsData, setProductImportsData] = useState([]);
    const [productExportsData, setProductExportsData] = useState([]);
    const [amountRice, setAmountRice] = useState(0);
    const [amountFlour, setAmountFlour] = useState(0);
    const [selectedProductExportId, setSelectedProductExportId] = useState("");
    const [amountImportAlcohol, setAmountImportAlcohol] = useState(0);
    const [selectedMemberName, setSelectedMemberName] = useState("");

    const handleCloseAdd = () => {
        setAmountRice(0)
        setAmountFlour(0)
        setShowAdd(false)
    };
    const handleShowAdd = () => setShowAdd(true);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [loading, setLoading] = useState(false);

    const [loadDataProductExports, { data: apolloDataProductExport }] = useLazyQuery(PRODUCT_EXPORTS, { fetchPolicy: "network-only" });
    const [loadDataProductImports, { data: apolloDataProductImport }] = useLazyQuery(PRODUCT_IMPORTS, { fetchPolicy: "network-only" });
    const [createProductImport] = useMutation(CREATE_PRODUCT_IMPORT);
    const [deleteProductImport] = useMutation(DELETE_PRODUCT_IMPORT);

    useEffect(() => {
        getProductExport()
        getProductImport()
    }, []);

    useEffect(() => {
        setProductExportsData(apolloDataProductExport?.productExports?.data);
    }, [apolloDataProductExport]);
    useEffect(() => {
        setProductImportsData(apolloDataProductImport?.productImports?.data);
        setProductImportsTotal(apolloDataProductImport?.productImports?.total);
    }, [apolloDataProductImport]);
    useEffect(() => {
        getProductImport()
    }, [startDate, endDate])

    const getProductExport = async () => {
        try {
            setLoading(true)
            loadDataProductExports({
                variables: {
                    skip: 0,
                    limit: 1000,
                    orderBy: "createdAt_DESC",
                }
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const getProductImport = async () => {
        try {
            setLoading(true)
            let _where = {}
            if (startDate !== "") _where = { ..._where, createdAt_gte: startDate ?? "" };
            if (endDate !== "") _where = { ..._where, createdAt_lt: moment(moment(endDate).add(1, "days")).format("YYYY-MM-DD") ?? "" };
            await loadDataProductImports({
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

    const onSelectProductExport = (e) => {
        try {
            setSelectedProductExportId(e.target.value)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const onCreateProductImport = async () => {
        try {
            setLoading(true)
            handleCloseAdd()
            await createProductImport({
                variables: {
                    data: {
                        productExport: selectedProductExportId,
                        amountRice: parseFloat(amountRice),
                        amountFlour: parseFloat(amountFlour),
                        amountImportAlcohol: parseFloat(amountImportAlcohol),
                    }
                }
            })
            customizeToast("success", "ນຳເຂົ້າວັດຖຸດິບສຳເລັດ!")
            getProductExport()
            getProductImport()
            onSelectProductExport("")
            setAmountRice(0)
            setAmountFlour(0)
            setAmountImportAlcohol(0)
            setLoading(false)
        } catch (error) {
            console.log("error: ", error)
            setLoading(false)
            customizeToast("error", "ເບີກວັດຖຸດິບບໍ່ສຳເລັດ!")
            handleCloseAdd()
        }
    }

    const deleteProduct = (e, data) => {
        e.stopPropagation()
        setDeleteId(data.id)
        setSelectedMemberName(data?.productExport?.member ? data?.productExport?.member?.fullName : "-")
        handleShowDelete()
    }

    const onDeleteProductImport = async () => {
        try {
            setLoading(true)
            handleCloseDelete()
            await deleteProductImport({
                variables: {
                    where: {
                        id: deleteId
                    }
                }
            })
            getProductImport()
            customizeToast("success", "ລົບວັດຖຸດິບສຳເລັດ!")
            setDeleteId("")
            setSelectedMemberName("")
            setLoading(false)
        } catch (error) {
            console.log("error: ", error)
            setLoading(false)
            customizeToast("error", "ລົບວັດຖຸດິບບໍ່ສຳເລັດ!")
            handleCloseDelete()
        }
    }

    const inputAmountImportAlcohol = async (e) => {
        setAmountImportAlcohol(e.target.value)
        var amountRice = parseInt(e.target.value) / 0.75;
        setAmountRice(amountRice)
        var amountFlour = parseInt(amountRice) / 80;
        setAmountFlour(amountFlour);
    }

    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row>
                <Col sm="12">
                    <div className="tap-custom">
                        <div className="tap-top-bar" onClick={() => history.push(Routs.RAW_MATERIALS_OUTPUT + `/limit/30/skip/1`)}>ວັດຖຸດິບອອກ</div>
                        <div className="tap-top-bar-active" onClick={() => history.push(Routs.SUPPLY_GOODS_LISTS + `/limit/30/skip/1`)}>ວັດຖຸດິບເຂົ້າ</div>
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
                    </div>
                </Col>
                {/* <Col sm="6">
                    <div className="card-title-custom">
                        <Row>
                            <Col sm="6">
                                <div className="card-supply-goods">
                                    <Row>
                                        <Col sm="3">
                                            <img src="/assets/image/seed-bag.png" alt='' width="50px" height="50px" />
                                        </Col>
                                        <Col sm="9" className='font-size-32 text-bold-700'>1000 ກ.ກ</Col>
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
                                        <Col sm="9" className='font-size-32 text-bold-700'>1000 ກ.ກ</Col>
                                        <Col sm="12" className="spgl-padding font-size-14">ຈຳນວນເຂົ້າທັງໝົດ</Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col> */}
            </Row>
            <div className="card-body">
                <div className="card-body-title">
                    <h4 ><b>ລາຍການວັດຖຸດິບເຂົ້າທັງໝົດ</b></h4>
                    <button className="btn-primary-web " style={{ marginTop: -30 }} onClick={handleShowAdd}>ເພີ່ມວັດຖຸດິບ</button>
                </div>
                <hr className='m-0' />

                <div className="margin-top">
                    {loading ? <Spinner animation="border" variant="primary" />
                        :
                        <Table responsive="xl">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ສະມາຊິກ</th>
                                    <th>ຈຳນວນເຫຼົ້າທີ່ນຳເຂົ້າ</th>
                                    <th>ຈຳນວນເຂົ້າທີ່ນຳໃຊ້</th>
                                    <th>ຈຳນວນແປ້ງທີ່ນຳໃຊ້</th>
                                    <th>ວັນທີນຳເຂົ້າ</th>
                                    <th>ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productImportsData?.map((item, index) => <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.productExport?.member?.fullName ?? "-"}</td>
                                    <td>{item?.amountImportAlcohol} ລິດ</td>
                                    <td>{item?.amountRice} ກ.ກ</td>
                                    <td>{item?.amountFlour} ກ.ກ</td>
                                    <td>{moment(item?.createdAt).format('DD/MM/YYYY HH:mm')} ໂດຍ {item?.createdBy?.fullName ?? "-"}</td>
                                    <td><button className='btn-list-delete' onClick={(e) => deleteProduct(e, item)}><FontAwesomeIcon icon={faTrash} /></button></td>
                                </tr>)}
                            </tbody>
                        </Table>}
                </div>
                {Pagination_helper(productImportsTotal, Routs.SUPPLY_GOODS_LISTS)}
            </div>
            <Modal
                show={showDelete}
                onHide={handleCloseDelete}
            >
                <Modal.Header closeButton>
                    <Modal.Title>ລົບການນຳເຂົ້າວັດຖຸດິບ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>ທ່ານຕ້ອງການລົບການນຳເຂົ້າວັດຖຸດິບໃຫ້ກັບ {selectedMemberName ?? "-"} ແທ້ບໍ່?</p>
                </Modal.Body>
                <div style={{ padding: 18 }}>
                    <button className="btn-primary-web" style={{ width: "100%" }} onClick={() => onDeleteProductImport()}>ຢືນຢັນ</button>
                </div>
            </Modal>
            <Modal
                show={showAdd}
                onHide={handleCloseAdd}
            >
                <Modal.Header closeButton>
                    <Modal.Title>ເພີ່ມວັດຖຸດິບ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>ລາຍການທີ່ເບີກອອກ</Form.Label>
                        <Form.Select onChange={(e) => onSelectProductExport(e)} value={selectedProductExportId}>
                            <option>ກະລຸນາເລືອກລາຍການທີ່ເບີກອອກ</option>
                            {productExportsData?.map((item, index) => <option key={index} value={item?.id}>({item?.member?.code}) {item?.member?.fullName ?? "-"}</option>)}
                        </Form.Select>
                        <br />
                        <Form.Group>
                            <Form.Label>ຈຳນວນເຫຼົ້າທີ່ນຳມາເຂົ້າ (ລິດ)</Form.Label>
                            <Form.Control type="number" placeholder="0"  onChange={(e) => inputAmountImportAlcohol(e)} />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>ຈຳນວນເຂົ້າທີ່ໃຊ້ໄປ (ກ.ກ)</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountRice} disabled />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>ຈຳນວນແປ້ງທີ່ໃຊ້ໄປ (ກ.ກ)</Form.Label>
                            <Form.Control type="number" placeholder="0" value={amountFlour}  />
                        </Form.Group>
                    </Form.Group>
                </Modal.Body>
                <div style={{ padding: 18 }}>
                    <button className="btn-primary-web" style={{ width: "100%" }} onClick={() => onCreateProductImport()}>ບັນທືກ</button>
                </div>
            </Modal>
        </>
    )
}
