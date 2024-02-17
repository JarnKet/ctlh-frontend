
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from 'formik';
import moment from 'moment';
import queryString from 'query-string';
// import * as Yup from "yup";
/**
 * @Component
 */
import { Form, Col, Row, Breadcrumb, Table, Spinner, Modal, Button } from 'react-bootstrap';
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

/**
 * @Apollo
 */
import { GET_RECEIVE } from '../../apollo/receive/Query';
import { DELETE_RECEIVE, CREATE_RECEIVE } from '../../apollo/receive/Mutation';
import { GET_PRODUCTS } from '../../apollo/product/Query';

/**
 * @Function
 */
import { currency, dateTimeLao } from '../../helper/index'
import { customizeToast } from '../../helper/toast';
import { USER_KEY } from '../../consts';
import PaginationHelper from '../../helper/PaginationHelper';
import Route from '../../consts/router';

export default function ReceiveList() {
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const location = useLocation();
    const parsed = queryString?.parse(location?.state);

    const [isLoading, setIsLoading] = useState(false);
    const [receivesData, setReceivesData] = useState([]);
    const [totals, setTotals] = useState("");
    const [productData, setProductData] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [idForEdit, setIdForEdit] = useState('');
    const [barcodeId, setBarcodeId] = useState('');
    const [searchBarcode, setSearchBarcode] = useState(parsed?.searchBarcode ? parsed?.searchBarcode : '');
    const [importNo, setImportNo] = useState(parsed?.importNo ? parsed?.importNo : '');
    const [productName, setProductName] = useState(parsed?.productName ? parsed?.productName : '');
    const [localStorageData, setLocalStorageData] = useState()
    const [startDate, setStartDate] = useState(parsed?.startDate ? parsed?.startDate : moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(parsed?.endDate ? parsed?.endDate : moment(moment()).format("YYYY-MM-DD"));

    const [deleteReceive] = useMutation(DELETE_RECEIVE);
    const [createReceive] = useMutation(CREATE_RECEIVE);
    const [loadDataReceives, { data: apolloDataReceives }] = useLazyQuery(GET_RECEIVE, {
        fetchPolicy: "network-only", variables: {
            skip: (_skip - 1) * _limit,
            limit: _limit,
        }
    });
    const [loadDataProduct, { data: apolloDataProduct }] = useLazyQuery(GET_PRODUCTS, { fetchPolicy: "network-only" });

    useEffect(() => {
        getDataFromLocal();
        fetchCReceives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (barcodeId !== '') loadDataProduct({ variables: { where: { barcode: barcodeId } } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barcodeId]);

    useEffect(() => {

        const fetchReceivesData = async () => {
            setIsLoading(true)
            var _where = {}
            if (searchBarcode !== '') _where = { ..._where, barcode: searchBarcode }
            if (importNo !== '') _where = { ..._where, importNo: importNo }
            if (productName !== '') _where = { ..._where, productName: productName }
            if (startDate !== "") _where = { ..._where, createdAtStart: startDate };
            if (endDate !== "") _where = { ..._where, createdAtEnd: endDate };
            await loadDataReceives({
                variables: {
                    where: _where,
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                }
            });
            setIsLoading(false)
        }
        fetchReceivesData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchBarcode, importNo, productName, startDate, endDate]);

    useEffect(() => {
        setReceivesData(apolloDataReceives?.receives?.data);
        setTotals(apolloDataReceives?.receives?.total);
        setProductData(apolloDataProduct?.products?.data);
    }, [apolloDataReceives, apolloDataProduct]);

    const getDataFromLocal = async () => {
        try {
            const _resData = await localStorage.getItem(USER_KEY)
            const _localJson = JSON.parse(_resData)
            if (_localJson?.data) {
                setLocalStorageData(_localJson?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCReceives = async () => {
        try {
            setIsLoading(true)
            await loadDataReceives();
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const handleShowAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowDelete = () => setShowDelete(true);
    const handleCloseDelete = () => setShowDelete(false);

    const _confirmDeleteReceive = async () => {
        try {
            await deleteReceive({ variables: { where: { id: idForEdit } } })
            loadDataReceives();
            customizeToast("success", "ລຶບປະເພດສິນຄ້າສຳເລັດ");
            // eslint-disable-next-line react-hooks/exhaustive-deps
        } catch (error) {
            customizeToast("error", "ລຶບບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!");
        }
        setShowDelete(false)
    }

    const _selectCodeForCopy = (e, code) => {
        e.stopPropagation()
        customizeToast("success", "ຄັດລອກ Barcode ແລ້ວ")
        navigator.clipboard.writeText(code)
    }

    return (
        <div className="body">
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>ສິນຄ້ານຳເຂົ້າ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-title">
                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>ລະຫັດບິນ</Form.Label>
                            <Form.Control type="type" placeholder="ຄົ້ນຫາລະຫັດບິນ" onChange={(e) => { setImportNo(e.target.value) }} defaultValue={importNo} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>ບາໂຄດສິນຄ້າ</Form.Label>
                            <Form.Control type="type" placeholder="ຄົ້ນຫາບາໂຄ້ດສິນຄ້າ" onChange={(e) => { setSearchBarcode(e.target.value) }} defaultValue={searchBarcode} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
                            <Form.Control type="type" placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ" onChange={(e) => { setProductName(e.target.value) }} defaultValue={productName} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md='4'>
                        <Form.Group>
                            <Form.Label>ວັນທີ</Form.Label>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md='4'>
                        <Form.Group>
                            <Form.Label>ຫາວັນທີ</Form.Label>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            <div className="card-body">
                <div className="card-body-title">
                    <h4 className="text-primary"><b>ສິນຄ້ານຳເຂົ້າ ({currency(totals)})</b></h4>
                    <button className="btn-primary-web" onClick={handleShowAdd}>+ ເພີ່ມສິນຄ້ານຳເຂົ້າ</button>
                </div>
                <div className="margin-top">
                    {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
                        <Table responsive="xl">
                            <thead>
                                <tr>
                                    <th>ລຳດັບ</th>
                                    <th>ລະຫັດບິນ</th>
                                    <th>ບາໂຄດສິນຄ້າ</th>
                                    <th>ຊື່ສິນຄ້າ</th>
                                    <th>ຈຳນວນ</th>
                                    {/* <th>ລາຄ້າຊື້</th>
                                    <th>ລາຍລະອຽດ</th>
                                    <th>ໝາຍເຫດ</th> */}
                                    <th>ວັນທີນຳເຂົ້າ</th>
                                    <th>ຈັດການ</th>
                                </tr>
                            </thead>
                            {receivesData?.map((item, idx) => {
                                return (
                                    <tbody key={idx}>
                                        <tr>
                                            <td>{idx + 1}</td>
                                            <td>
                                                {item?.importNo}
                                                <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.importNo)} />
                                            </td>
                                            <td>
                                                {item?.productId?.barcode}
                                                <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.productId?.barcode)} />
                                            </td>
                                            <td>
                                                {item?.productId?.name}
                                                <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.productId?.name)} />
                                            </td>
                                            <td>{item?.qty}</td>
                                            <td>{dateTimeLao(item?.createdAt)}</td>
                                            <td>
                                                <button className='btn-list-delete' onClick={(e) => {
                                                    setIdForEdit(item?.id)
                                                    handleShowDelete(e, item)
                                                }}
                                                ><FontAwesomeIcon icon={faTrash} /> </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })}
                        </Table>}

                    {Pagination_helper(totals, Route.RECEIVE_LIST,
                        `importNo=${importNo}&&searchBarcode=${searchBarcode}&&productName=${productName}&&startDate=${startDate}&&endDate=${endDate}`
                    )}
                </div>
            </div>
            <Formik
                enableReinitialize
                initialValues={{
                    qty: 0,
                    productId: productData ? productData[0]?.id : '',
                    productName: productData ? productData[0]?.name : '',
                    importNo: '',
                    userExportId: localStorageData ? localStorageData?.id : ''
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.importNo) errors.importNo = 'ກະລຸນາປ້ອນລະຫັດບິນ!'
                    return errors;
                }}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        delete values.productName
                        await createReceive({
                            variables: { data: { ...values } }
                        });
                        setShowAdd(false);
                        loadDataReceives();
                        customizeToast("success", "ເພີ່ມສິນຄ້ານຳເຂົ້າສຳເລັດ");
                        resetForm({ values: '' })
                    } catch (error) {
                        console.log('error: ', error);
                        customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
                    }
                }}
            >
                {({ values, errors, handleChange, handleSubmit }) => (
                    <Modal show={showAdd} onHide={handleCloseAdd}>
                        <Modal.Header closeButton>
                            <Modal.Title>ເພີ່ມສິນຄ້ານຳເຂົ້າ</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col sm="12">
                                    <Form.Group className="mb-3">
                                        <Form.Label>ບາໂຄດສິນຄ້າ<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" onChange={(e) => {
                                            setBarcodeId(e.target.value)
                                            handleChange(e)
                                        }} placeholder="ກະລຸນາເພີ່ມ"
                                            name="barcodeIn" value={values.barcodeIn}
                                            isInvalid={!!errors.barcodeIn} />
                                        {errors.barcodeIn ? (<div className="text-danger">{errors.barcodeIn}</div>) : null}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
                                        <Form.Control type="hidden" placeholder="ກະລຸນາເພີ່ມ" name="productId" value={values.productId} disabled />
                                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="productName" value={values.productName} disabled />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ຈຳນວນ</Form.Label>
                                        <Form.Control type="number" placeholder="0" min={0} name="qty" onChange={handleChange} value={values.qty} />
                                    </Form.Group>
                                    {/* <Form.Group className="mb-3">
                                        <Form.Label>ລາຍລະອຽດສິນຄ້າ</Form.Label>
                                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="detail" onChange={handleChange} value={productData !== undefined ? productData[0]?.detail : '-'} />
                                    </Form.Group> */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>ລະຫັດບິນ<span className="text-danger"> *</span></Form.Label>
                                        <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="importNo" onChange={handleChange} value={values.importNo} isInvalid={!!errors.importNo} />
                                        {errors.importNo ? (<div className="text-danger">{errors.importNo}</div>) : null}
                                    </Form.Group>
                                    {/* <Form.Group className="mb-3">
                                        <Form.Label>ໝາຍເຫດ</Form.Label>
                                        <Form.Control as="textarea" type="text" placeholder="ກະລຸນາເພີ່ມ" name="note" onChange={handleChange} value={productData !== undefined ? productData[0]?.note : '-'} />
                                    </Form.Group> */}
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAdd}>
                                ຍົກເລີກ
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                ເພີ່ມສິນຄ້າ
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Formik>


            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title><b>ຢືນຢັນການລຶບ</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>ຕ້ອງການລຶບປະເພດສິນຄ້ານີ້ ຫຼື ບໍ່!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        ຍົກເລີກ
                    </Button>
                    <Button variant="primary" onClick={() => _confirmDeleteReceive()}>
                        ຢືນຢັນ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
