import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";

import { Form, Col, Row, Breadcrumb, Table } from "react-bootstrap";
import { ADDRESSES } from '../../consts/salavanProvince'
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { BOIL_ALCOHOLS } from "../../apollo/boilAlcohols/query"
import Routs from "../../consts/router";
import { currency } from "../../helper/index"

export default function ProductionProcessLists() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [provincesName, setProvincesName] = useState("")
  const [districtsName, setDistrictsName] = useState("")
  const [districts, setDistricts] = useState([])
  const [villages, setVillages] = useState([])
  const [villageName, setVillageName] = useState("");
  const [boilAlcoholsData, setBoilAlcoholsData] = useState([])

  const [loadBoilAlcohols, { data }] = useLazyQuery(BOIL_ALCOHOLS, { fetchPolicy: "network-only" });

  useEffect(() => {
    loadBoilAlcohols()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setBoilAlcoholsData(data?.boilAlcohols?.data)
  }, [data])

  useEffect(() => {
    const fetchBoilAlcoholData = async () => {
      setIsLoading(true)
      let _where = { }
      if (codeSearch !== "") _where = { ..._where, member: codeSearch ?? "" };
      if (provincesName !== "") _where = { ..._where, province: provincesName ?? "" };
      if (districtsName !== "") _where = { ..._where, district: districtsName ?? "" };
      if (villageName.trim().length > 0) _where = { ..._where, village: villageName ?? "" };
      await loadBoilAlcohols({
        variables: {
          where: _where,
          // skip: (_skip - 1) * _limit,
          // limit: _limit,
        }
      });
      setIsLoading(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    fetchBoilAlcoholData();
  }, [codeSearch, provincesName, districtsName, villageName])

  /**
   *
   * @Function
   *
   */

  const _historyPush = (context) => {
    history.push(context);
  };

  const _selectProvince = (pro) => {
    const pro_id = _.findIndex(ADDRESSES?.provinces, { pr_id: pro.target.value });
    setProvincesName(ADDRESSES?.provinces[pro_id]?.pr_name);
    setDistricts(ADDRESSES?.provinces[pro_id]?.districts);
  }
  const _selectDistrict = (dist) => {
    const dist_id = _.findIndex(districts, { dr_id: dist.target.value });
    setDistrictsName(districts[dist_id]?.dr_name);
    setVillages(districts[dist_id]?.villages);
  }
  return (
    <div>
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ຂະບວນການຜະລິດ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title">
        {/* <Form.Group className="mb-3">
          <Form.Label>ຄົ້ນຫາ</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => { setCodeSearch(e.target.value) }}
            placeholder="ລະຫັດສະມາຊິກ"
          />
        </Form.Group> */}
        <Row>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ແຂວງ</Form.Label>
              <Form.Select onChange={(e) => _selectProvince(e)}>
                {ADDRESSES?.provinces?.map((pro, index) => {
                  return (
                    <option key={index} value={pro?.pr_id}>{pro?.pr_name}</option>
                  )
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ເມືອງ</Form.Label>
              <Form.Select onChange={(e) => _selectDistrict(e)} >
                {districts?.map((dist, indexDist) => {
                  return (<option key={indexDist} value={dist?.dr_id} >{dist?.dr_name}</option>)
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          {/* <Col sm="3">
            <Form.Group className="mb-3">
              <Form.Label>ກຸ່ມບ້ານ</Form.Label>
              <Form.Select>
                <option>ກະລຸນາເລືອກ</option>
                <option>Disabled select</option>
                <option>Disabled select</option>
              </Form.Select>
            </Form.Group>
          </Col> */}
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ບ້ານ</Form.Label>
              <Form.Select onChange={(e) => setVillageName(e.target.value)}>
                {villages?.map((village, position) => {
                  return (<option key={position} value={village?.vill_name} >{village?.vill_name}</option>)
                })}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* <Row>
          <Form.Group className="mb-3">
            <Form.Label>ສະຖານະປະຈຸບັນ</Form.Label>
            <Form.Select>
              <option>ທັງໝົດ</option>
              <option>Disabled select</option>
              <option>Disabled select</option>
            </Form.Select>
          </Form.Group>
        </Row> */}
      </div>
      <div className="card-body">
        <div className="float-right">
          <button
            className="btn-primary-Excel"
            onClick={() => _historyPush(Routs.USER_ADD)}
          >
            <span className="btn-space">
              {" "}
              <FontAwesomeIcon icon={faFileExcel} />
              ດາວໂຫຼດ Excel
            </span>
          </button>
        </div>

        <div className="margin-top">
          <Table responsive="xl">
            <thead>
              <tr>
                <th>#</th>
                <th>ລະຫັດສະມາຊິກ</th>
                <th>ຊື່ສະມາຊິກ</th>
                <th>ບ້ານ</th>
                {/* <th>ກຸ່ມບ້ານ</th> */}
                <th>ຈຳນວນເຂົ້າທີ່ໃຊ້</th>
                <th>ຈຳນວນແປ້ງທີ່ໃຊ້</th>
                <th>ຈຳນວນເຫຼົ້າທີ່ໄດ້</th>
                <th>ສະຖານະປະຈຸບັນ</th>
              </tr>
            </thead>
            <tbody>
              {boilAlcoholsData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.member?.code}</td>
                    <td>{item?.member?.fullName}</td>
                    <td>{item?.member?.village}</td>
                    <td>{currency(item?.amountRice)} ກ.ລ </td>
                    <td>{currency(item?.amountFlour)} ກ.ລ</td>
                    <td>{currency(item?.amountCalculatedAlcohol)} ລ</td>
                    <td>
                      <button
                        className="btn-status-rice"
                        onClick={() =>
                          history.push(Routs.HISTORY_BOIL_ALCOHOL_DETAIL + "/" + `${item?.id}`)
                        }
                      >
                        ມ່າເຂົ້າ
                      </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
