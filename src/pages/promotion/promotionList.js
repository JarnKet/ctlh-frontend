import React, { useState, useEffect } from 'react'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Table, Button, Spinner, Breadcrumb } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_PROMOTION_LIST } from './apollo/query';
import PaginationHelper from '../../helper/PaginationHelper';
import consts from '../../consts';
import Routs from "../../consts/router";
import moment from 'moment';
import { DELETE_PROMOTION } from './apollo/mutation';
import { currency } from '../../helper';

export default function PromotionList() {
    const history = useHistory();
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [total, setTotal] = useState(0);
    const [promotionData, setPromotionData] = useState([]);
    const [getPromotions, { data: apolloDataPromotion }] = useLazyQuery(GET_PROMOTION_LIST, { fetchPolicy: "network-only" });
    const [deletePromotion] = useMutation(DELETE_PROMOTION);

    useEffect(() => {
        fetchPromotionsData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (apolloDataPromotion) {
            setPromotionData(apolloDataPromotion?.promotions?.data);
            setTotal(apolloDataPromotion?.promotions?.total);
        }
    }, [apolloDataPromotion]);

    const fetchPromotionsData = async () => {
        try {
            setIsLoading(true)
            await getPromotions({
                variables: {
                    where: { isDeleted: false },
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

    const updatePromotion = async (e, id) => {
        try {
            e.stopPropagation()
            history.push("/promotion-edit/" + id)
        } catch (error) {
            console.log(error)
        }
    }

    const onDeletePromotion = async (e, id) => {
        try {
            e.stopPropagation()
            setDeleteId(id)
            setShow(true);
        } catch (error) {
            console.log(error)
        }
    }

    const confirmDelete = async () => {
        try {
            await deletePromotion({ variables: { where: { id: deleteId } } })
            fetchPromotionsData()
            setShow(false)
        } catch (error) {
            console.log(error)
            setShow(false)
        }
    }

    return (
        <div className="body">
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>Promotions</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-body">
                <div className="card-body-title">
                    <div className="card-body-btn-type">
                        <h4 className="text-primary"><b>Promotions ({total})</b></h4>
                    </div>
                    <button className="btn-primary-web" onClick={() => history.push("/promotion-add")}>+ ເພີ່ມ Promotion</button>
                </div>
                {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
                    <Table responsive="xl">
                        <thead>
                            <tr>
                                <th>ລຳດັບ</th>
                                <th>ຮູບພາບ</th>
                                <th>Code</th>
                                <th>ຫົວຂໍ້ Promotion</th>
                                <th>Promotion</th>
                                <th>ມື້ເລີ່ມ</th>
                                <th>ມື້ໝົດກຳນົດ</th>
                                <th>ສະຖານະ</th>
                                <th>ຈັດການ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotionData?.map((item, index) => {
                                let checkStartDate = moment(item?.startDate).diff(moment(), "day")
                                let checkEndDate = moment(item?.endDate).diff(moment(), "day")

                                return <tr key={index} onClick={() => history.push("/promotion-detail/" + item["id"])}>
                                    <td>{index + 1}</td>
                                    <td><img className='product-img' src={item?.image ? consts.URL_FOR_SHOW_PHOTO + item?.image : "/assets/image/promotion.webp"} alt="" style={{ width: 35, height: 35 }} /></td>
                                    <td>{item?.code}</td>
                                    <td>{item?.title}</td>
                                    <td>{currency(item?.discount)} {item?.typePromotion === "MONEY" ? "ກີບ" : "%"}</td>
                                    <td>{moment(item?.startDate).format("DD/MM/yyyy")}</td>
                                    <td>{moment(item?.endDate).format("DD/MM/yyyy")}</td>
                                    <td style={{ color: (checkStartDate <= 0 && checkEndDate > 0) ? "#2E72D2" : "#D21C1C" }}>{(checkStartDate <= 0 && checkEndDate > 0) ? "ໃຊ້ງານຢູ່" : "ປີດໃຊ້ງານຢູ່"}</td>
                                    <td>
                                        <button className='btn-list-edit' onClick={(e) => updatePromotion(e, item["id"])}><FontAwesomeIcon icon={faEdit} /></button>
                                        <button className='btn-list-delete' onClick={(e) => onDeletePromotion(e, item["id"])}><FontAwesomeIcon icon={faTrash} /> </button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
                {Pagination_helper(total, Routs.PROMOTION_LIST)}
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
        </div>
    )
}
