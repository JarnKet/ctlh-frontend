import React, { useState, useEffect } from 'react'
import UploadPhoto from '../../helper/UploadPhoto';
import { Breadcrumb, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useHistory, useRouteMatch } from "react-router-dom";
import moment from 'moment';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_PROMOTION } from './apollo/query';
import { UPDATE_PROMOTION } from './apollo/mutation';

export default function PromotionEdit() {
    const history = useHistory();
    const match = useRouteMatch();
    const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();
    const [promotionCode, setPromotionCode] = useState("");
    const [promotionTitle, setPromotionTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [discount, setDiscount] = useState(0);
    const [typePromotion, setTypePromotion] = useState("PERCENT");
    const [startDate, setStartDate] = useState(moment("2023-05-01").format("yyyy-MM-DD"));
    const [endDate, setEndDate] = useState(moment("2023-05-31").format("yyyy-MM-DD"));

    const [isLoading, setIsLoading] = useState(false);
    const [getPromotion, { data: apolloDataPromotion }] = useLazyQuery(GET_PROMOTION, { fetchPolicy: "network-only" });
    const [updatePromotion] = useMutation(UPDATE_PROMOTION);

    useEffect(() => {
        fetchPromotionData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(apolloDataPromotion)
        if (apolloDataPromotion) {
            setPromotionCode(apolloDataPromotion?.promotion?.code)
            setPromotionTitle(apolloDataPromotion?.promotion?.title)
            setDetail(apolloDataPromotion?.promotion?.detail)
            setDiscount(apolloDataPromotion?.promotion?.discount)
            setTypePromotion(apolloDataPromotion?.promotion?.typePromotion)
            setStartDate(moment(apolloDataPromotion?.promotion?.startDate).format("yyyy-MM-DD"))
            setEndDate(moment(apolloDataPromotion?.promotion?.endDate).format("yyyy-MM-DD"))
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

    const onUpdatePromotion = async () => {
        try {
            setIsLoading(true)
            let data = {
                title: promotionTitle,
                code: promotionCode,
                startDate: startDate,
                endDate: endDate,
                discount: discount,
                typePromotion: typePromotion,
                detail: detail
            }
            if (namePhoto) data = { ...data, image: namePhoto }
            await updatePromotion({ variables: { data, where: { id: match?.params?.id } } })
            setIsLoading(false)
            history.goBack()
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => history.goBack()}>ລາຍການ Promotion</Breadcrumb.Item>
                    <Breadcrumb.Item active>ແກ້ໄຂ Promotion</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-add">
                <h4><b>ແກ້ໄຂ Promotion</b></h4>
                <hr />
                <div className="card-add-body">
                    {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> : <Row>
                        <Col sm="3">
                            <h6>ອັບໂຫຼດຮູບພາບ <span className="text-danger">*</span></h6>
                            {buttonUploadAndShowPhoto()}
                        </Col>

                        <Col sm="9">
                            <div style={{ marginTop: 25 }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Promotion Code <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder="ຕົວຢ່າງ: TD-1234" name="code" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>ຫົວຂໍ້ Promotion <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder="ຕົວຢ່າງ: Promotion ຕ້ອນຮັບປີໃໝ່ລາວ" name="title" value={promotionTitle} onChange={(e) => setPromotionTitle(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">

                                    {/* <Row> */}
                                        {/* <Col sm='9'> */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Promotion (ກີບ) <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="number" placeholder="ຕົວຢ່າງ: 99,000 ກີບ" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                            </Form.Group>
                                        {/* </Col> */}
                                        {/* <Col sm='3'>
                                            <Form.Group className="mb-3">
                                                <Form.Label>ປະເພດ</Form.Label>
                                                <Form.Select onChange={(e) => setTypePromotion(e.target.value)}>
                                                    <option value="PERCENT">%</option>
                                                    <option value="MONEY">ກີບ</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col> */}
                                    {/* </Row> */}

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>ລາຍລະອຽດ</Form.Label>
                                    <Form.Control as="textarea" type="text" rows="4" placeholder="ເພີ່ມລາຍລະອຽດເພີ່ມຕື່ມກ່ຽວກັບ promotion ຂອງທ່ານ" value={detail} onChange={(e) => setDetail(e.target.value)} name="description" />
                                </Form.Group>
                                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                    <Form.Group className="mb-3" style={{ width: "100%" }}>
                                        <Form.Label>ເລີ່ມວັນທີ <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                    </Form.Group>
                                    <div style={{ width: 30 }} />
                                    <Form.Group className="mb-3" style={{ width: "100%" }}>
                                        <Form.Label>ຫາວັນທີ <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="card-add-bottom">
                                <button className="btn-cancel-web" disabled={isLoading} onClick={() => history.goBack()}>ຍົກເລີກ</button>
                                <button className="btn-confirm-web" disabled={isLoading} onClick={() => onUpdatePromotion()}>ບັນທືກ</button>
                            </div>
                        </Col>
                    </Row>}
                </div>
            </div>
        </div>
    )
}
