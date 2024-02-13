
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
import { Form, Col, Row, Breadcrumb, Table, Spinner, Modal, Button } from 'react-bootstrap';
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
import Consts from "../../consts";
/**
 * @Apollo
 */
import { GET_PRODUCTS } from '../../apollo/product/Query';
import { DELETE_PRODUCT } from '../../apollo/product/Mutation';
/**
 * @Function
 */
import { currency } from '../../helper/index'
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';

export default function ProductList() {
  const history = useHistory();
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [productsData, setProductsData] = useState([]);
  const [totals, setTotals] = useState("");
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [productNameSearch, setProductNameSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  /**
   *
   * @Apollo
   *
   */
  const [loadDataProducts, { data: apolloDataProducts }] = useLazyQuery(GET_PRODUCTS, { fetchPolicy: "network-only" });
  const [deleteDataProduct] = useMutation(DELETE_PRODUCT);
  /**
 *
 * @useEffect
 *
 */
  useEffect(() => {
    fetchProductData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let _where = {isDeleted: false}
    if (barcodeSearch !== "") _where = { ..._where, barcode: barcodeSearch ?? "" };
    if (productNameSearch !== "") _where = { ..._where, name: productNameSearch ?? "" };
    loadDataProducts({
      variables: {
        where: _where,
        skip: (_skip - 1) * _limit,
        limit: _limit,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeSearch, productNameSearch]);

  useEffect(() => {
    if (apolloDataProducts) { setProductsData(apolloDataProducts?.products?.data); setTotals(apolloDataProducts?.products?.total) }
  }, [apolloDataProducts]);

  /**
   *
   * @Function
   *
   */

  const _historyPush = (context) => history.push(context)
  const _updateProduct = (e, item) => {
    e.stopPropagation()
    history.push(Routs.PRODUCT_EDIT + "/" + item);
  }

  const _deleteProduct = (e, item) => { e.stopPropagation(); setShow(true); setProductId(item?.id) }
  const _confirmDeleteProduct = async () => {
    try {
      const deleteProduct = await deleteDataProduct({ variables: { where: { id: productId } } });
      if(deleteProduct?.data?.deleteProduct?.id) {
        customizeToast("success", "ລຶບສິນຄ້າສຳເລັດ")
        loadDataProducts({
          variables: {
            where: { isDeleted: false },
            skip: (_skip - 1) * _limit,
            limit: _limit,
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error) {
      customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
    setShow(false);
  }

  const fetchProductData = async () => {
    try {
      setIsLoading(true)
      await loadDataProducts({
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
  const _selectCodeForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກ Barcode ແລ້ວ")
    navigator.clipboard.writeText(code)
  }
  const handleClose = () => setShow(false);

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ສິນຄ້າ</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="card-title">
        <Row>
          <h4 className="text-primary"><b>ຄົ້ນຫາ</b></h4>
          <Col sm='6' className='mt-3'>
            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="type" placeholder="ຄົ້ນຫາດ້ວຍ Barcode" onChange={(e) => setBarcodeSearch(e.target.value)} />
            </Form.Group>
          </Col>
          <Col sm='6' className='mt-3'>
            <Form.Group className="mb-3" >
              <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
              <Form.Control type="type" placeholder="ຄົ້ນຫາດ້ວຍຊື່ສິນຄ້າ" onChange={(e) => setProductNameSearch(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ສິນຄ້າ ({currency(totals)})</b></h4>
          <button className="btn-primary-web" onClick={() => _historyPush(Routs.PRODUCT_ADD)}>+ ເພີ່ມສິນຄ້າ</button>
        </div>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ຮູບສິນຄ້າ</th>
                  <th>barcode</th>
                  <th>ຊື່ສິນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາຊຶ້</th>
                  <th>ລາຄາຂາຍ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              {productsData?.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr onClick={() => _historyPush(Routs.PRODUCT_DETAIL + "/" + item?.id)}>
                      <td>{index + 1 + _limit * (_skip - 1)}</td>
                      <td><img className='product-img' src={Consts.URL_FOR_SHOW_PHOTO + item?.image} alt="" /></td>
                      <td>{item?.barcode} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.barcode)} /></td>
                      <td>{item?.name} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.name)} /></td>
                      <td>{currency(item?.qty)}</td>
                      <td>{currency(item?.buyPrice) + " " + item?.typeMoney}</td>
                      <td>{currency(item?.sellPice) + " " + item?.typeMoney}</td>
                      <td>
                        <button className='btn-list-edit' onClick={(e) => _updateProduct(e, item?.id)}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className='btn-list-delete' onClick={(e) => _deleteProduct(e, item)}><FontAwesomeIcon icon={faTrash} /> </button>
                      </td>
                    </tr>
                  </tbody>
                )
              })}
            </Table>}
          {Pagination_helper(totals, Routs.PRODUCT_LIST)}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນລຶບສິນຄ້າ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການລຶບສິນຄ້ານີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button className='bg-primary' onClick={() => _confirmDeleteProduct()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
