import React, { useState, useEffect } from 'react'

import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash"
import moment from "moment";

import { Form, Col, Row, Breadcrumb, Table, Spinner } from 'react-bootstrap';
import { faEdit, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";

import { GET_USERS } from '../../apollo/user/Query';
import { ADDRESSES } from '../../consts/salavanProvince'
import Routs from "../../consts/router";
import PaginationHelper from '../../helper/PaginationHelper';
import { customizeToast } from '../../helper/toast';
import { dateTimeLao } from '../../helper/index'

export default function MemberList() {
    const history = useHistory();
    const { _limit, _skip, Pagination_helper } = PaginationHelper();
    const [membersData, setMembersData] = useState([]);
    const [totals, setTotals] = useState("");
    const [codeSearch, setCodeSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [provincesName, setProvincesName] = useState("")
    const [districtsName, setDistrictsName] = useState("")
    const [districts, setDistricts] = useState([])
    const [villages, setVillages] = useState([])
    const [villageName, setVillageName] = useState("");
    const [startDate, setStartDate] = useState(moment(moment().add(-1, "months")).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment(moment()).format("YYYY-MM-DD"));

    const [loadDataMembers, { data: apolloDaaUsers }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });

    useEffect(() => {
        fetchUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (apolloDaaUsers) { setMembersData(apolloDaaUsers?.users?.data); setTotals(apolloDaaUsers?.users?.total) }
    }, [apolloDaaUsers]);

    useEffect(() => {
        const fetchMemberData = async () => {
            setIsLoading(true)
            let _where = { role: "MEMBER" }
            if (codeSearch !== "") _where = { ..._where, code: codeSearch ?? "" };
            if (provincesName !== "") _where = { ..._where, province: provincesName ?? "" };
            if (districtsName !== "") _where = { ..._where, district: districtsName ?? "" };
            if (villageName.trim().length > 0 ) _where = { ..._where, village: villageName ?? "" };
            if (startDate !== "" ) _where = { ..._where, memberAt_gte: startDate ?? "" };
            if (endDate !== "" ) _where = { ..._where, memberAt_lt: moment(moment(endDate).add(1, "days")).format("YYYY-MM-DD") ?? "" };
            await loadDataMembers({
                variables: {
                    where: _where,
                    skip: (_skip - 1) * _limit,
                    limit: _limit,
                }
            });
            setIsLoading(false)
        }
        fetchMemberData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeSearch, provincesName, districtsName, villageName, startDate, endDate]);
    const fetchUserData = async () => {
        try {
            setIsLoading(true)
            await loadDataMembers({
                variables: {
                    where: { role: "MEMBER" },
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

    const _historyPush = (context) => history.push(context)

    const _selectCodeForCopy = (e, code) => {
        e.stopPropagation()
        customizeToast("success", "ຄັດລອກລະຫັດພະນັກງານແລ້ວ")
        navigator.clipboard.writeText(code)
    }

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
        <div className="body">
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" active>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-title">
                <Form.Group className="mb-3">
                    <Form.Label>ຄົ້ນຫາ</Form.Label>
                    <Form.Control type="text" placeholder="ລະຫັດສະມາຊິກ" onChange={(e) => { setCodeSearch(e.target.value) }} />
                </Form.Group>
                <Row>
                    <Col sm='4'>
                        <Form.Group className="mb-4">
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
                    <Col sm='4'>
                        <Form.Group className="mb-4">
                            <Form.Label>ເມືອງ</Form.Label>
                            <Form.Select onChange={(e) => _selectDistrict(e)} >
                                {districts?.map((dist, indexDist) => {
                                    return (<option key={indexDist} value={dist?.dr_id} >{dist?.dr_name}</option>)
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm='4'>
                        <Form.Group className="mb-4">
                            <Form.Label>ບ້ານ</Form.Label>
                            <Form.Select onChange={(e) => setVillageName(e.target.value)}>
                                {villages?.map((village, position) => {
                                    return (<option key={position} value={village?.vill_name} >{village?.vill_name}</option>)
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                </Row>
                <Row>
                    <Col sm='6'>
                        <Form.Group className="mb-3">
                            <Form.Label>ວັນທີເປັນສະມາຊິກຕັ້ງແຕ່</Form.Label>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col sm='6'>
                        <Form.Group className="mb-3">
                            <Form.Label>ເຖິງ ວັນທີເປັນສະມາຊິກ</Form.Label>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            <div className="card-body">
                <div className="card-body-title">
                    <div className="card-body-btn-type">
                        {/* <button>ຈຳນວນເຂົ້າໝົດ</button>
                        <button>ຈຳນວນແປ້ງໝົດ</button> */}
                    </div>
                    <button className="btn-primary-web" onClick={() => _historyPush(Routs.MEMBER_ADD)}>+ ເພີ່ມສະມາຊິກ</button>
                </div>
                <h4 className="text-primary"><b>ສະມາຊິກຕົ້ມເຫຼົ້າທັງໝົດ {totals}  ຄົນ</b></h4>
                <div className="margin-top">
                    {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
                        <Table responsive="xl">
                            <thead>
                                <tr>
                                    <th>ລຳດັບ</th>
                                    <th>ລະຫັດສະມາຊິກ</th>
                                    <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                                    <th>ບ້ານ</th>
                                    {/* <th>ກຸ່ມບ້ານ</th> */}
                                    <th>ຈຳນວນເຂົ້າ</th>
                                    <th>ຈຳນວນແປ້ງ</th>
                                    <th>ຈຳນວນເຫຼົ້າທີ່ຄົງຄ້າງ</th>
                                    <th>ວັນທີເປັນສະມາຊິກ</th>
                                    <th>ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody>{membersData?.map((item, index) => {
                                return (
                                    <tr onClick={() => _historyPush(Routs.MEMBER_DETAIL +"/"+ item?.id)}>
                                        <td>{index + 1 + _limit * (_skip - 1)}</td>
                                        <td>{item?.code} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.code)} /></td>
                                        <td>{item?.fullName}</td>
                                        <td>{item?.village}</td>
                                        <td>{item?.amountRice} ກ.ກ</td>
                                        <td>{item?.amountFlour} ກ.ກ</td>
                                        <td>{item?.amountDebtAlcohol} ລ</td>
                                        <td>{dateTimeLao(item?.memberAt)}</td>
                                        <td>
                                            <button className='btn-list-edit'><FontAwesomeIcon icon={faEdit} /></button>
                                            <button className='btn-list-delete'><FontAwesomeIcon icon={faTrash} /> </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    }
                    {Pagination_helper(totals, Routs.MEMBER_LIST)}
                </div>
            </div>
        </div>
    )
}
