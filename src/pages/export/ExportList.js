
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from "@apollo/client";
/**
 * @Library
 */
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import queryString from 'query-string';

/**
 * @Component
 */
import { Form, Col, Row, Breadcrumb, Table, Spinner } from 'react-bootstrap';
import { faCopy } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
/**
 * @Apollo
 */
import { GET_EXPORTS } from '../../apollo/exportProduct/Query';

/**
 * @Function
 */
import { currency, dateTimeLao } from '../../helper/index'
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';

export default function ExportList() {
  const history = useHistory();
  const location = useLocation();
  const parsed = queryString?.parse(location?.state);
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [exportsData, setExportsData] = useState([]);
  const [totals, setTotals] = useState("");
  const [productName, setProductName] = useState(parsed?.productName ? parsed?.productName : "");
  const [startDate, setStartDate] = useState(parsed?.startDate ? parsed?.startDate : moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(parsed?.endDate ? parsed?.endDate : moment(moment()).format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  /**
   *
   * @Apollo
   *
   */
  const [loadDataExports, { data: apolloDataExports }] = useLazyQuery(GET_EXPORTS, { fetchPolicy: "network-only" });
  /**
 *
 * @useEffect
 *
 */
  useEffect(() => {
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let _where = {productType: "EXPORT", isDeleted: false}
    if (productName !== "") _where = { ..._where, productName: productName };
    if (startDate !== "") _where = { ..._where, createdAtStart: startDate };
    if (endDate !== "") _where = { ..._where, createdAtEnd: endDate };
    loadDataExports({
      variables: {
        where: _where,
        skip: (_skip - 1) * _limit,
        limit: _limit,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName, startDate, endDate]);

  useEffect(() => {
    if (apolloDataExports) { setExportsData(apolloDataExports?.receives?.data); setTotals(apolloDataExports?.receives?.total) }
  }, [apolloDataExports]);

  /**
   *
   * @Function
   *
   */

  const _historyPush = (context) => history.push(context)

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      await loadDataExports({
        variables: {
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
  const _selectProductNameForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກຊື່ສິນຄ້າແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ເບີກສິນຄ້າ</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="card-title">
        <Row>
          <Col md='4'>
            <Form.Group className="mb-3">
              <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
              <Form.Control type="text" placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ" onChange={(e) => setProductName(e.target.value)} defaultValue={productName} />
            </Form.Group>
          </Col>
          <Col md='4'>
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີ</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md='4'>
            <Form.Group className="mb-3">
              <Form.Label>ຫາວັນທີ</Form.Label>
              <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ເບີກສິນຄ້າ ({totals})</b></h4>
          <button className="btn-primary-web" onClick={() => _historyPush(Routs.EXPORT_ADD)}>+ ເພີ່ມລາຍການ</button>
        </div>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ຊື່ສິນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                  <th>ຜູ້ເບີກ</th>
                  <th>ວັນທີເບີກ</th>
                </tr>
              </thead>
              {exportsData?.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1 + _limit * (_skip - 1)}</td>
                      <td>{item?.productName} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectProductNameForCopy(e, item?.productName)} /></td>
                      <td>{currency(item?.qty)}</td>
                      <td>{item?.userExportId?.fullName}</td>
                      <td>{dateTimeLao(item?.createdAt)}</td>
                    </tr>
                  </tbody>
                )
              })}
            </Table>}
          {Pagination_helper(totals, Routs.EXPORT_LIST, `productName=${productName}&&startDate=${startDate}&&endDate=${endDate}`)}
        </div>
      </div>
    </div>
  )
}
