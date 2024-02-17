import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import Constant from '../../consts/index'
import Routs from '../../consts/router'

import { GET_PRODUCT } from '../../apollo/product/Query';
import { DELETE_PRODUCT } from '../../apollo/product/Mutation';

import { customizeToast } from '../../helper/toast';

export default function ProductDetail() {
    const history = useHistory();
    const match = useRouteMatch();
    const [dataProduct, setDataProduct] = useState();
    const [show, setShow] = useState(false);

    const [loadDataProduct, { data: apolloDataProduct, loading }] = useLazyQuery(GET_PRODUCT);
    const [deleteDataProduct] = useMutation(DELETE_PRODUCT);
    useEffect(() => {
        loadDataProduct({ variables: { where: { id: match?.params?.id } } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match?.params?.id])

    useEffect(() => {
        if (apolloDataProduct)
        setDataProduct(apolloDataProduct?.product)
    }, [apolloDataProduct])

    const _updateProduct = (id) => history.push(Routs.PRODUCT_EDIT + "/" + id);
    const _deleteProduct = (item) => { setShow(true); }
    const _confirmDeleteUser = async () => {
        try {
            const deleteProduct = await deleteDataProduct({ variables: { where: { id: match?.params?.id } } });
            if(deleteProduct?.data?.deleteProduct?.id) {
                customizeToast("success", "ລຶບສິນຄ້າສຳເລັດ")
                history.push(Routs.PRODUCT_LIST + '/limit/30/skip/1')
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        } catch (error) {
            console.log('error', error)
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
            <div className="card-add">
                <div className="card-add-title">
                    <h4><b>ລາຍລະອຽດ</b></h4>
                    <div>
                        <button className="btn-edit" onClick={(e) => _updateProduct(dataProduct?.id)}><FontAwesomeIcon icon={faEdit} /> ແກ້ໄຂ</button>
                        <button className="btn-delete" onClick={(e) => _deleteProduct(dataProduct?.id)}><FontAwesomeIcon icon={faTrash} /> ລຶບ</button>
                    </div>
                </div>
                <hr />
                <div className="card-add-body">
                    <Row>
                        <Col sm="3">
                            <h5><b>ຮູບພາບ</b></h5>
                            {dataProduct?.profileImage ? 
                            <img src={Constant.URL_FOR_SHOW_PHOTO + dataProduct?.profileImage} alt="" className="box-upload-image" />
                            : <img src="/assets/image/profile.png" className="box-upload-image" alt="" />}
                        </Col>
                        <Col sm="9">
                            <div style={{ marginTop: 25, marginBottom: 100 }}>
                                <Row>
                                    <Col sm="6">Barcode</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.barcode ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ປະເພດສິນຄ້າ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.categoryId?.name ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຊື່ສິນຄ້າ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.name ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ລາຄາຊຶ້</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.buyPrice ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ລາຄາຂາຍ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.sellPice ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ສະກຸນເງິນທີ່ຈ່າຍ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.typeMoney ?? "-"}</Col>
                                </Row>
                                <hr />
                                {/* <Row>
                                    <Col sm="6">ລາຍລະອຽດ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.detail ?? "-"}</Col>
                                </Row>
                                <hr /> */}
                                <Row>
                                    <Col sm="6">ໝາຍເຫດ</Col>
                                    <Col sm="6" className="text-right">{dataProduct?.note ?? "-"}</Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>ຢືນຢັນສິນຄ້າ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>ຕ້ອງການສິນຄ້ານີ້ ຫຼື ບໍ່!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            ຍົກເລີກ
                        </Button>
                        <Button className='bg-primary' onClick={() => _confirmDeleteUser()}>
                            ຢືນຢັນ
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
