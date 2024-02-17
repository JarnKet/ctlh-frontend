import React, {useEffect, useState} from 'react'
import { useHistory, useRouteMatch } from "react-router-dom";
import { useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Breadcrumb, Row, Col } from 'react-bootstrap';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Routs from "../../consts/router";
import {BOIL_ALCOHOL} from "../../apollo/boilAlcohols/query"
import {dateTimeLao, currency} from "../../helper/index"
import "./style.css"

export default function HistoryBoilAlcoholDetail() {
    const history = useHistory();
    const match = useRouteMatch();

    const [boilAlcohol, setBoilAlcohol] = useState({})

  const [loadBoilAlcohol, { data }] = useLazyQuery(BOIL_ALCOHOL, {fetchPolicy: "network-only"});

  useEffect(() => {
    loadBoilAlcohol({variables: {where: {id: match?.params?.id}}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.params?.id])
  
  useEffect(() => {
    setBoilAlcohol(data?.boilAlcohol)
  }, [data])
  

    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>ບຸນກອງນອງພະຈັນ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="tap-custom">
                {/* <div className="tap-top-bar" onClick={() => history.push(Routs.MEMBER_DETAIL)}>ຂໍ້ມູນທົ່ວໄປ</div> */}
                <div className="tap-top-bar-active" onClick={() => history.push(Routs.HISTORY_BOIL_ALCOHOL)}>ຂໍ້ມູນທົ່ວໄປ</div>
            </div>
            <div className="card-add">
                <div className="card-add-title">
                    <h4><b>ລາຍລະອຽດ</b></h4>
                </div>
                <hr />
                <div className="card-add-body">
                    <div className="stepper-wrapper">
                        <div className="stepper-item completed">
                            <div className="step-counter"><FontAwesomeIcon icon={faCheck} color="#fff" /></div>
                            <div>ມ່າເຂົ້າ</div>
                            <div className="step-name">
                                <div>ວັນທີ່ເລີ່ມ {dateTimeLao(boilAlcohol?.startSoakRiceDate) ?? "-"}</div>
                                <div>ວັນທີສຳເລັດ {dateTimeLao(boilAlcohol?.endSoakRiceDate) ?? "-"}</div>
                                <div>ວັນທີສຳເລັດຕົວຈິງ {dateTimeLao(boilAlcohol?.realEndSoakRiceDate) ?? "-"}</div>
                            </div>
                        </div>
                        <div className="stepper-item completed">
                            <div className="step-counter"><FontAwesomeIcon icon={faCheck} color="#fff" /></div>
                            <div>ຕົ້ມເຫຼົ້າ</div>
                            <div className="step-name">
                                <div>ວັນທີ່ຕົ້ມ  {dateTimeLao(boilAlcohol?.startBoilRiceDate) ?? "-" }</div>
                                <div>ວັນທີສຳເລັດ {dateTimeLao(boilAlcohol?.endBoilRiceDate) ?? "-" }</div>
                                <div>ໄລຍະເວລາພັກເຂົ້າ {dateTimeLao(boilAlcohol?.boilRiceTime) ?? "-" }</div>
                            </div>
                        </div>
                        <div className="stepper-item active">
                            <div className="step-counter"><FontAwesomeIcon icon={faCheck} color="#fff" /></div>
                            <div>ສຳເລັດ</div>
                            <div className="step-name">
                                <div>ວັນທີ່ສຳເລັດ -</div>
                            </div>
                        </div>
                    </div>
                    <Col sm="12">
                            <div style={{ marginTop: 25, marginBottom: 100 }}>
                                <Row>
                                    <Col sm="6">ຈຳນວນເຂົ້າທີ່ໃຊ້</Col>
                                    <Col sm="6" className="text-right">{currency(boilAlcohol?.amountRice) ?? 0} ກ.ກ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຈຳນວນແປ້ງທີ່ໃຊ້</Col>
                                    <Col sm="6" className="text-right">{currency(boilAlcohol?.amountFlour) ?? 0} ກ.ກ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຈຳນວນເຫຼົ້າທີ່ໄດ້</Col>
                                    <Col sm="6" className="text-right text-danger">{currency(boilAlcohol?.amountCalculatedAlcohol) ?? 0} ລ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ລະຫັດສະມາຊິກ</Col>
                                    <Col sm="6" className="text-right text-danger">{boilAlcohol?.member?.code ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ແຂວງ</Col>
                                    <Col sm="6" className="text-right">{boilAlcohol?.member?.province ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ເມືອງ</Col>
                                    <Col sm="6" className="text-right">{boilAlcohol?.member?.district ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ບ້ານ</Col>
                                    <Col sm="6" className="text-right">{boilAlcohol?.member?.village ?? "-"}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ກຸ່ມບ້ານ</Col>
                                    <Col sm="6" className="text-right">ກຸ່ມ 3</Col>
                                </Row>
                                <hr />
                            </div>
                        </Col>
                </div>
            </div>
        </>
    )
}
