import React, { useState, useEffect } from 'react'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, Col, Modal, Row, Spinner } from 'react-bootstrap'
import { useHistory, useRouteMatch } from "react-router-dom";
import { GET_PROMOTION } from './apollo/query';
import { useLazyQuery, useMutation } from '@apollo/client';
import consts from '../../consts';
import moment from 'moment';
import { DELETE_PROMOTION } from './apollo/mutation';

export default function PromotionDetail() {
    const history = useHistory();
    const match = useRouteMatch();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [promotionData, setPromotionData] = useState({});
    const [getPromotion, { data: apolloDataPromotion }] = useLazyQuery(GET_PROMOTION, { fetchPolicy: "network-only" });
    const [deletePromotion] = useMutation(DELETE_PROMOTION);

    useEffect(() => {
        fetchPromotionData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(apolloDataPromotion)
        if (apolloDataPromotion) {
            setPromotionData(apolloDataPromotion?.promotion);
        }
    }, [apolloDataPromotion]);

    const fetchPromotionData = async () => {
        try {
            setIsLoading(true)
            await getPromotion({
                variables: {
                    where: { id: match?.params?.id },
                }
            });
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const confirmDelete = async () => {
        try {
            await deletePromotion({ variables: { where: { id: match?.params?.id } } })
            setShow(false)
            history.goBack()
        } catch (error) {
            console.log(error)
            setShow(false)
        }
    }

    return (
        <div>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ລາຍການ Promotion</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>ລາຍລະອຽດ Promotion</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-add">
                <div className="card-add-title">
                    <h4><b>ລາຍລະອຽດ</b></h4>
                    <div>
                        <button className="btn-edit" onClick={() => history.push(`/promotion-edit/${match?.params?.id}`)}><FontAwesomeIcon icon={faEdit} /> ແກ້ໄຂ</button>
                        <button className="btn-delete" onClick={() => setShow(true)}><FontAwesomeIcon icon={faTrash} /> ລຶບ</button>
                    </div>
                </div>
                <br />
                <hr />
                {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> : <div className="card-add-body">
                    <Row>
                        <Col sm="3">
                            <h6>ຮູບພາບ</h6>
                            <img src={promotionData?.image ? consts.URL_FOR_SHOW_PHOTO + promotionData?.image : "/assets/image/promotion.webp"} className="box-upload-image" alt="" />
                        </Col>
                        <Col sm="9">
                            <div style={{ marginTop: 25, marginBottom: 100 }}>
                                <Col><b>Promotion Code:</b></Col>
                                <Col>{promotionData?.code}</Col>
                                <br />
                                <hr />
                                <Col><b>ຫົວຂໍ້:</b></Col>
                                <Col>{promotionData?.title}</Col>
                                <br />
                                <hr />
                                <Col><b>Promotion:</b></Col>
                                <Col>{promotionData?.discount} ກີບ</Col>
                                <br />
                                <hr />
                                <Col><b>ລາຍລະອຽດ:</b></Col>
                                <Col>{promotionData?.detail}</Col>
                                <br />
                                <hr />
                                <Col><b>ໄລຍະເວລາ:</b></Col>
                                <Col>ວັນທີ {moment(promotionData?.startDate).format("DD-MM-yyyy")}  ຫາ  ວັນທີ {moment(promotionData?.endDate).format("DD-MM-yyyy")}</Col>
                                <br />
                                <hr />
                            </div>
                        </Col>
                    </Row>
                </div>}
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ຢືນຢັນການລຶບ Promotion</Modal.Title>
                </Modal.Header>
                <Modal.Body>ທ່ານຕ້ອງການລຶບ Promotion ນີ້ແທ້?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShow(false)}>
                        ຍົກເລີກ
                    </Button>
                    <Button variant='danger' onClick={() => confirmDelete()}>
                        ຢືນຢັນ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
