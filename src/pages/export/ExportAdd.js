import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Component
 */
import { Form, Col, Row, Breadcrumb, Table, Modal, Button } from 'react-bootstrap';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
/**
 * @Apollo
 */
import { GET_USERS } from '../../apollo/user/Query';
import { GET_PRODUCTS } from '../../apollo/product/Query';
import { CREATE_EXPORT } from '../../apollo/exportProduct/Mutation';
import { customizeToast } from '../../helper/toast';
import { convertErrorMessage } from '../../helper';


function ExportAdd() {
    const history = useHistory();
    const [dataProduct, setDataProduct] = useState({})
    const [qty, setQty] = useState(1)
    // const [detail, setDetail] = useState("")
    const [userId, setUserId] = useState("")
    const [isShow, setIsShow] = useState(false)
    const [barcode, setBarcode] = useState("")
    const [noProductMessage, setNoProductMessage] = useState("")
    const [exportProductArray, setExportProductArray] = useState([])
    
    const [createExport] = useMutation(CREATE_EXPORT)

    const [loadDataProduct] = useLazyQuery(GET_PRODUCTS, { fetchPolicy: "network-only" });
    const [loadDataUser, { data: apolloDataUser }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });
    
    useEffect(() => {
        loadDataUser({
            variables: { where: { roleAnd: ['ADMIN', 'STAFF_STOCK', 'STAFF', 'COUNTER'] } }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const _add = async () => {
        const productData = await loadDataProduct({variables: {where: {barcode: barcode}}})
        
        if(productData?.data?.products?.total === 0) {
            setNoProductMessage("ສິນຄ້ານີ້ບໍ່ມີໃນລະບົບ");
            return;
        }
        setNoProductMessage("")
        setDataProduct(productData?.data?.products?.data[0])
        setIsShow(true)
    }

    const _addExportProductArray = () => {
        if(!qty) return;
        setExportProductArray([ 
            ...exportProductArray, 
            { 
                // categoryId: dataProduct?.categoryId?.id, 
                // categoryName: dataProduct?.categoryId?.name, 
                productId: dataProduct?.id, 
                productName: dataProduct?.name,
                qty: parseInt(qty),
                // detail: detail,
                userExportId: userId
            }
        ])
        setDataProduct({})
        setIsShow(false)
        setBarcode("")
    }

    const _removeItem = (index) => {
        let remove = exportProductArray.splice(index, 1);
        let _newData = exportProductArray?.filter((item) => item !== remove[0]);
        setExportProductArray(_newData);
    }

    const _createExportProduct = async (data) => {
        try {
            for (let i = 0; i < data.length; i++) {
                delete data[i]?.productName
            }
            await createExport({
              variables: { data: data }
            });
            customizeToast("success", "ເພີ່ມຂໍ້ມູນສຳເລັດ");
            history.push(Routs.EXPORT_LIST +'/limit/30/skip/1')
          } catch (error) {
            console.log(error)
            customizeToast("error", convertErrorMessage(error?.message));
          }
    }

  return (
    <div className="body">
        <div className="breadcrumb">
            <Breadcrumb>
                <Breadcrumb.Item href="#" onClick={() => history.push(Routs.EXPORT_LIST + "/limit/50/skip/1")}>ລາຍການເບີກທັງໝົດ</Breadcrumb.Item>
                <Breadcrumb.Item href="#" active>ເພີ່ມລາຍການເບີກ</Breadcrumb.Item>
            </Breadcrumb>
        </div>

        <div className="card-body">
            <div className="card-body-title">
                <h4 className="text-primary"><b>ເພີ່ມລາຍການເບີກ</b></h4>
            </div>

            <div className='margin-top'>
                <Row style={{alignItems: "flex-end"}}>
                    <Col sm={5}>
                        <Form.Label>ຜູ້ເບີກ</Form.Label>
                        <Form.Select
                            name="user"
                            onChange={(e) => setUserId(e.target.value)}
                            style={{height: 44}}
                        >
                        <option value="">ກາລຸນາເລືອກຜູ້ເບີກ</option>
                        {apolloDataUser && apolloDataUser?.users?.data?.map((item, index) => (
                            <option key={index} value={item?.id}>
                                {item?.fullName}
                            </option>
                            )
                        )}
                        </Form.Select>
                    </Col>
                    <Col sm={5}>
                        <Form.Label>Barcode</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="ປ້ອນ ຫຼື ສະແກນ Barcode"
                            name="barcode"
                            style={{height: 44}}
                            onChange={(e) => setBarcode(e.target.value)}
                            value={barcode}
                        />
                    </Col>
                    <Col>
                        <button className="btn-primary-web" disabled={barcode === "" ? true : false} onClick={() => _add()}>+ ເພີ່ມ</button>
                    </Col>
                </Row>
                <span className='text-danger'>{noProductMessage}</span>
                <Table responsive="xl" className='mt-5'>
                <thead>
                    <tr>
                    <th>ລຳດັບ</th>
                    <th>ຊື່ສິນຄ້າ</th>
                    <th colSpan={2}>ຈຳນວນ</th>
                    </tr>
                </thead>
                <tbody>
                    {exportProductArray?.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td style={{width: 50}} className='text-center'>{index + 1}</td>
                                <td>{item?.productName}</td>
                                <td style={{width: 100}}>{item?.qty}</td>
                                <td className='text-center'><button className='btn-list-delete' onClick={() => _removeItem(index)}><FontAwesomeIcon icon={faTrash} /></button></td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                <div className='d-flex justify-content-end mt-5'>
                    <Button variant="secondary" onClick={() => history.push(Routs.EXPORT_LIST + "/limit/50/skip/1")}>
                        ຍົກເລີກ
                    </Button>
                    <Button variant="primary" className='ml-2' onClick={() => _createExportProduct(exportProductArray)}>
                        ບັນທຶກລາຍການເບີກ
                    </Button>
                </div>
            </div>
        </div>
        <Modal show={isShow} onHide={() => setIsShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>ເພີ່ມລາຍການເບີກ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm="12">
                        <Form id='myForm'>
                            {/* <Form.Group className="mb-3">
                                <Form.Label>ປະເພດສິນຄ້າ</Form.Label>
                                <Form.Control type="text" value={dataProduct?.categoryId?.name} disabled />
                            </Form.Group> */}
                            <Form.Group className="mb-3">
                                <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
                                <Form.Control type="text" value={dataProduct?.name} name="name" disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>ຈຳນວນ</Form.Label>
                                <Form.Control type="number" placeholder="0" min={1} name="qty" onChange={(e) => setQty(e.target.value)} defaultValue={1} isInvalid={qty ? false : true} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setIsShow(false)}>
                    ຍົກເລີກ
                </Button>
                <Button variant="primary" onClick={() => _addExportProductArray()}>
                    ເພີ່ມ
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ExportAdd