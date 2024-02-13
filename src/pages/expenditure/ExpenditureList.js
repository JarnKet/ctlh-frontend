import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
/**
 * @Library
 */
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
/**
 * @Component
 */
import { Form, Col, Row, Breadcrumb, Table, Spinner } from "react-bootstrap";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

/**
 * @Constant
 */

import Routs from "../../consts/router";
/**
 * @Apollo
 */
import { EXPENDITURES, GET_CATEGORY_EXPENDITURE, } from "../../apollo/expenditure/Query";

/**
 * @Function
 */
import { dateTimeLao } from "../../helper/index";
import PaginationHelper from "../../helper/PaginationHelper";
import { ConcertPayMethod, currencyFormat, formatDateDash } from "../../consts/function";
import Navbar from "./Navbar";
import { customizeToast } from '../../helper/toast';



export default function ExpenditureList() {
  var dateNow = formatDateDash(new Date());
  var dateLast = moment(moment(dateNow).add(-30, "days")).format("YYYY-MM-DD");
  const history = useHistory();
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [usersData, setUsersData] = useState([]);
  const [totals, setTotals] = useState("");
  const [nameSearch, setnameSearch] = useState("");
  const [billNumberSearch, setBillNumberSearch] = useState("");
  const [categoryIdSearch, setcategoryIdSearch] = useState("");
  const [paymentMoneySearch, setpaymentMoneySearch] = useState("");
  const [typeMoneySearch, setTypeMoneySearch] = useState("");
  const [payDateStartSearch, setpayDateStartSearch] = useState(dateLast);
  const [payDateEndSearch, setPayDateEndSearch] = useState(dateNow);
  const [createdAtStartSearch, setCreatedAtStartSearch] = useState(dateLast);
  const [createdAtEndSearch, setCreatedAtEndSearch] = useState(dateNow);

  const [isLoading, setIsLoading] = useState(false);

  /**
   *
   * @Apollo
   *
   */
  const [loadDataUsers, { data: apolloDataExpenditure }] = useLazyQuery(
    EXPENDITURES,
    { fetchPolicy: "network-only" }
  );
  /**
   *
   * @useEffect
   *
   */

  useEffect(() => {
    fetchUserData();
    getCategoryFinnace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    billNumberSearch,
    nameSearch,
    categoryIdSearch,
    paymentMoneySearch,
    typeMoneySearch,
    payDateStartSearch,
    payDateEndSearch,
    createdAtStartSearch,
    createdAtEndSearch,
  ]);
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      await loadDataUsers({
        variables: {
          where: {
            billNumeber: billNumberSearch ? billNumberSearch : undefined,
            name: nameSearch ? nameSearch : undefined,
            categoryExpenditureId: categoryIdSearch
              ? categoryIdSearch
              : undefined,
            paymentMethod: paymentMoneySearch ? paymentMoneySearch : undefined,
            typeMoney: typeMoneySearch ? typeMoneySearch : undefined,
            paydateStart: payDateStartSearch,
            paydateEnd: payDateEndSearch,
            createdAtStart: createdAtStartSearch,
            createdAtEnd: createdAtEndSearch,
          },
          skip: (_skip - 1) * _limit,
          limit: _limit,
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const [getCategoryFinnace, { data: categoryFinnace }] = useLazyQuery(
    GET_CATEGORY_EXPENDITURE
  );

  useEffect(() => {
    if (apolloDataExpenditure) {
      setUsersData(apolloDataExpenditure?.expenditures?.data);
      setTotals(apolloDataExpenditure?.expenditures?.total);
    }
  }, [apolloDataExpenditure]);

  /**
   *
   * @Function
   *
   */

  const _historyPush = (context) => history.push(context);

  const _selectCodeForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກສຳເລັດ")
    navigator.clipboard.writeText(code)
  }
  console.log("🚀 ~ file: ExpenditureList.js:337 ~ ExpenditureList ~ apolloDataExpenditure:", apolloDataExpenditure)

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ລາຍຈ່າຍ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Navbar />
      <div className="card-title">
        <Row>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ຄົ້ນຫາເລກໃບບິນ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ເລກໃບບິນ"
                onChange={(e) => {
                  setBillNumberSearch(e?.target?.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ຄົ້ນຫາຫົວຂໍ້</Form.Label>
              <Form.Control
                type="type"
                placeholder="ຫົວຂໍ້"
                onChange={(e) => {
                  setnameSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group className="mb-3">
              <Form.Label>ປະເພດ</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setcategoryIdSearch(e.target.value);
                }}
              >
                <option value="">ທັງໝົດ</option>
                {categoryFinnace?.categoryExpenditures?.data?.map((item) => (
                  <option value={item?.id}>{item?.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group className="mb-3">
              <Form.Label>ຈ່າຍຜ່ານ</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setpaymentMoneySearch(e.target.value);
                }}
              >
                <option value="">ທັງໝົດ</option>
                <option value="PAY_CASH">ເງີນສົດ</option>
                <option value="PAY_ONLINE">ເງີນໂອນ</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group className="mb-3">
              <Form.Label>ສະກຸນເງິນ</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setTypeMoneySearch(e.target.value);
                }}
              >
                <option value="">ທັງໝົດ</option>
                <option value="LAK">LAK</option>
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ບີນຂອງວັນທີເລີມ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateLast}
                onChange={(e) => {
                  setpayDateStartSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ບີນຂອງວັນທີສິນສຸດ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateNow}
                onChange={(e) => {
                  setPayDateEndSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີສ້າງເລີມ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateLast}
                onChange={(e) => {
                  setCreatedAtStartSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີສ້າງສິນສຸດ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateNow}
                onChange={(e) => {
                  setCreatedAtEndSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text">
            <b>ລາຍຈ່າຍທັງໝົດ {totals}</b>
          </h4>
          <button
            className="btn-primary-web"
            onClick={() => _historyPush(Routs.EXPENDITURE_ADD)}
          >
            + ເພີ່ມລາຍຈ່າຍ
          </button>
        </div>

        <div className="margin-top">
          {isLoading ? (
            <div className="loading-page">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ເລກໃບບິນ</th>
                  <th>ຫົວຂໍ້</th>
                  <th>ປະເພດ</th>
                  <th>ຈ່າຍຜ່ານ </th>
                  <th>ຈຳນວນເງິນ </th>
                  <th>ສະກຸນເງິນ </th>
                  <th>ບີນຂອງວັນທີ</th>
                  <th>ວັນເດືອນປີ</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() =>
                        _historyPush(Routs.EXPENDITURE_DETAIL + "/" + item?.id)
                      }
                    >
                      <td>{index + 1 + _limit * (_skip - 1)}</td>
                      <td>{item?.billNumeber} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.billNumeber)} /></td>
                      <td>{item?.name}<FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.name)} /></td>
                      <td>{item?.categoryExpenditureId?.name}</td>
                      <td>{ConcertPayMethod(item?.paymentMethod)}</td>
                      <td>{currencyFormat(item?.amount)}</td>
                      <td>{item?.typeMoney}</td>
                      <td>{dateTimeLao(item?.paydate)}</td>
                      <td>
                        <div>
                          <div>{item?.createdBy?.fullName}</div>
                          <div>{dateTimeLao(item?.createdAt)}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={5}>ລວມ LAK :</td>
                  <td colSpan={4}>{currencyFormat(apolloDataExpenditure?.expenditures?.amountLak)}</td>
                </tr>
                <tr>
                  <td colSpan={5}>ລວມ USD :</td>
                  <td colSpan={4}>{currencyFormat(apolloDataExpenditure?.expenditures?.amountUsd)}</td>
                </tr>
                <tr>
                  <td colSpan={5}>ລວມ THB :</td>
                  <td colSpan={4}>{currencyFormat(apolloDataExpenditure?.expenditures?.amountThb)}</td>
                </tr>
                <tr>
                  <td colSpan={5}>ລວມ CNY :</td>
                  <td colSpan={4}>{currencyFormat(apolloDataExpenditure?.expenditures?.amountCny)}</td>
                </tr>
              </tbody>
            </Table>
          )}
          {Pagination_helper(
            apolloDataExpenditure?.expenditures?.total,
            Routs.EXPENDITURE_LIST
          )}
        </div>
      </div>
    </div>
  );
}
