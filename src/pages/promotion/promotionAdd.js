import React, { useState } from 'react'
import UploadPhoto from '../../helper/UploadPhoto';
import { Breadcrumb, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import { CREATE_PROMOTION } from './apollo/mutation';
import { useMutation } from '@apollo/client';

export default function PromotionAdd() {
    const history = useHistory();
    const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();
    const [isLoading, setIsLoading] = useState(false)
    const [promotionCode, setPromotionCode] = useState("");
    const [promotionTitle, setPromotionTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [discount, setDiscount] = useState(0);
    const [startDate, setStartDate] = useState(moment().format("yyyy-MM-DD"));
    const [endDate, setEndDate] = useState(moment(moment().add(30, "days")).format("yyyy-MM-DD"));
    const [createEntryAndExit] = useMutation(CREATE_PROMOTION);

    const createPromotion = async () => {
        try {
            setIsLoading(true)
            let data = {
                title: promotionTitle,
                code: promotionCode,
                startDate: startDate,
                endDate: endDate,
                discount: discount,
                typePromotion: "MONEY",
                image: namePhoto,
                detail: detail
            }
            await createEntryAndExit({ variables: { data } })
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
                    <Breadcrumb.Item active>ເພີ່ມ Promotion</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-add">
                <h4><b>ເພີ່ມ Promotion</b></h4>
                <hr />
                <div className="card-add-body">
                    <Row>
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
                                    <Form.Label>Promotion (ກີບ)<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="number" min={0} placeholder="ຕົວຢ່າງ: 99,000 ກີບ" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>ລາຍລະອຽດ</Form.Label>
                                    <Form.Control as="textarea" type="text" rows="4" placeholder="ເພີ່ມລາຍລະອຽດເພີ່ມຕື່ມກ່ຽວກັບ promotion ຂອງທ່ານ" value={detail} onChange={(e) => setDetail(e.target.value)} name="detail" />
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
                                <button className="btn-confirm-web" disabled={isLoading} onClick={() => createPromotion()} >{isLoading ? <Spinner as="span" animation="border" role="status" aria-hidden="true" /> : "ບັນທືກ"}</button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
