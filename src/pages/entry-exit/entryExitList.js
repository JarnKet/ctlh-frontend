
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Col, Row, Breadcrumb, Table, Spinner } from 'react-bootstrap';
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Routs from "../../consts/router";
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';
import { GET_ENTRYS_AND_EXITS } from './apollo/query';
import moment from 'moment';

export default function EntryExitList() {
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [entryExitData, setEntryExitData] = useState([]);
  const [totals, setTotals] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [cateSearch, setCateSearch] = useState("");
  const [startDateSearch, setStartDateSearch] = useState(moment(moment().add(-30, "days")).format("yyyy-MM-DD"));
  const [endDateSearch, setEndDateSearch] = useState(moment().format("yyyy-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const [entryAndExits, { data: apolloDataEntryExit }] = useLazyQuery(GET_ENTRYS_AND_EXITS, { fetchPolicy: "network-only" });

  useEffect(() => {
    fetchEntryExitData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEntryExitData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch, phoneSearch, cateSearch, startDateSearch, endDateSearch]);

  useEffect(() => {
    if (apolloDataEntryExit) {
      setEntryExitData(apolloDataEntryExit?.entryAndExits?.data);
      setTotals(apolloDataEntryExit?.entryAndExits?.total);
    }
  }, [apolloDataEntryExit]);

  const fetchEntryExitData = async () => {
    try {
      setIsLoading(true)
      let _where = {
        createdAtStart: moment(startDateSearch).format("yyyy-MM-DD"),
        createdAtEnd: moment(endDateSearch).format("yyyy-MM-DD"),
      }
      if (dataSearch !== "") _where = { ..._where, userName: dataSearch ?? "" };
      if (phoneSearch !== "") _where = { ..._where, phone: phoneSearch ?? "" };
      if (cateSearch !== "") _where = { ..._where, category: cateSearch ?? "" };
      await entryAndExits({
        variables: {
          where: _where,
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
    customizeToast("success", "ຄັດລອກລະຫັດພະນັກງານແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  const _selectPhoneForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກເບີໂທແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  const convertType = (cate, type) => {
    let result = ""
    if (cate === "EXIT") {
      switch (type) {
        case "NORMAL":
          result = "ເລີກວຽກປົກກະຕິ"
          break;
        case "OUTSIDE":
          result = "ອອກວຽກນອກ"
          break;

        default:
          break;
      }
    } else {
      switch (type) {
        case "NORMAL":
          result = "ເຂົ້າວຽກປົກກະຕິ"
          break;
        case "OUTSIDE":
          result = "ກັບຈາກອອກວຽກນອກ"
          break;

        default:
          break;
      }
    }

    return result;
  }

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ການເຂົ້າ-ອອກ</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title" style={{ marginTop: 10 }}>
        <Row>
          <Col sm='6'>
            <Form.Group className="mb-3">
              <Form.Label>ຄົ້ນຫາ</Form.Label>
              <Form.Control type="type" placeholder="ລະຫັດພະນັກງານ" onChange={(e) => { setDataSearch(e.target.value) }} />
            </Form.Group>
          </Col>
          <Col sm='6'>
            <Form.Group className="mb-3">
              <Form.Label>ເບີໂທ</Form.Label>
              <Form.Control type="type" placeholder="ຄົ້ນຫາດ້ວຍເບີໂທ" onChange={(e) => setPhoneSearch(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm='4'>
            <Form.Group className="mb-3">
              <Form.Label>ໝວດ</Form.Label>
              <Form.Select onChange={(e) => { setCateSearch(e.target.value) }}>
                <option value="">ທັງໝົດ</option>
                <option value="ENTRY">ເຂົ້າ</option>
                <option value="EXIT">ເລີກ</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີ</Form.Label>
              <Form.Control type="date" value={startDateSearch} onChange={(e) => setStartDateSearch(e.target.value)} />
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className="mb-3">
              <Form.Label>ຫາວັນທີ</Form.Label>
              <Form.Control type="date" value={endDateSearch} onChange={(e) => setEndDateSearch(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ລາຍການເຂົ້າ-ອອກ ({totals})</b></h4>
        </div>
        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດພະນັກງານ</th>
                  <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                  <th>ເບີໂທ</th>
                  <th>ວັນເວລາ</th>
                  <th>ໝວດ</th>
                  <th>ປະເພດ</th>
                </tr>
              </thead>
              <tbody>
                {entryExitData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1 + _limit * (_skip - 1)}</td>
                      <td>{item?.userName ?? "-"} <FontAwesomeIcon icon={faCopy} className="icon-copy" style={{ color: item?.category === "EXIT" ? "#f74e48" : "#1e81fa" }} onClick={(e) => _selectCodeForCopy(e, item?.userName)} /></td>
                      <td>{item?.userId?.fullName ?? "-"}</td>
                      <td>{item?.phone ?? "-"} <FontAwesomeIcon icon={faCopy} className="icon-copy" style={{ color: item?.category === "EXIT" ? "#f74e48" : "#1e81fa" }} onClick={(e) => _selectPhoneForCopy(e, item?.phone)} /></td>
                      <td>{item?.displayTime}</td>
                      <td>
                        <div style={{ width: 80, height: 30, borderRadius: 24, backgroundColor: item?.category === "EXIT" ? "#f74e48" : "#1e81fa", color: "#ffffff", textAlign: "center", padding: 4, fontWeight: "bold" }}>
                          {item?.category === "EXIT" ? "ອອກ" : "ເຂົ້າ"}
                        </div>
                      </td>
                      <td>{convertType(item?.category, item?.type)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>}
          {Pagination_helper(totals, Routs.ENTRY_EXIT_LIST)}
        </div>
      </div>
    </div>
  )
}
