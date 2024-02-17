import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faDownload, faUpload, faUser, faUsers, faProjectDiagram, faBell } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import moment from "moment";
import { DASHBOARD } from "../../apollo/dashboard/Query";
import { useLazyQuery } from "@apollo/client";
import { Form, Col, Row, Breadcrumb } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { currency } from "../../helper";

ChartJS.register(ArcElement, Tooltip, Legend);



export default function DashboardPage() {
  var dateNow = moment(new Date()).format("YYYY-MM-DD");
  var dateLast = moment(new Date()).format("YYYY-MM-DD");
  const [dateStartSearch, setdateStartSearch] = useState(dateNow);
  const [dateEndSearch, setdateEndSearch] = useState(dateLast);
  // const [loading, setLoading] = useState(false);

  const [loadDashboard, { data: apolloDashboard }] = useLazyQuery(DASHBOARD, {
    fetchPolicy: "network-only",
    variables:{
      "where": {
        "startDate": dateStartSearch,
        "endDate": moment(moment(dateEndSearch).add(1, "day")).format("YYYY-MM-DD"),
      }
    }
  });

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDashboardData = async () => {
    try {
      // setLoading(true);
      await loadDashboard();
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
  console.log("🚀 ~ file: index.js:242 ~ DashboardPage ~ apolloDashboard?.dashBroad?:", apolloDashboard?.dashBroad)

  return (
    <div className="main">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ລາຍງານ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="card-add" style={{marginTop: -25}}>
        <div style={{marginTop: -20, marginBottom: 15}}>
        <h3>ລາຍງານ</h3>
        </div>
        <Row>
        <Col sm="6">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີເລີມ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={dateNow}
                onChange={(e) => {
                  setdateStartSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="6">
            <Form.Group className="mb-3">
              <Form.Label>ວັນທີສິນສຸດ</Form.Label>
              <Form.Control
                type="date"
                defaultValue={ dateLast}
                onChange={(e) => {
                  setdateEndSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col md='3'>
            <div className="dash-card">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon  id="icon" icon={faBoxesStacked} size="2x" />
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ສິນຄ້າທັງໝົດ</b>
                  <div>{apolloDashboard?.dashBroad?.product} ລາຍການ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='3'>
            <div className="dash-card">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon icon={faDownload} id="icon1" size="2x" />
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ນຳເຂົ້າສິນຄ້າ</b>
                  <div>{apolloDashboard?.dashBroad?.exportProduct} ລາຍການ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='3'>
            <div className="dash-card">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon icon={faUpload} id="icon2" size="2x" />
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ນຳອອກສີນຄ້າ</b>
                  <div>{apolloDashboard?.dashBroad?.importProduct} ລາຍການ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='3'>
            <div className="dash-card">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon icon={faBell} id="icon2" size="2x"/>
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ສີນຄ້າໃກ້ໝົດ</b>
                  <div>{apolloDashboard?.dashBroad?.productCloseToAll} ລາຍການ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <div style={{height:10}}></div>
          <Col md='4'>
            <div className="dash-cardB">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon icon={faUsers} id="icon3" size="2x" style={{color: "#FFD25E"}}/>
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ພະນັກງານ</b>
                  <div>ເຂົ້າວຽກ {apolloDashboard?.dashBroad?.staffEntryAndExit?.entry} ຄົນ</div>
                  <div>ອອກວຽກ {apolloDashboard?.dashBroad?.staffEntryAndExit?.exit} ຄົນ</div>
                  <div>ລາພັກ {apolloDashboard?.dashBroad?.staffEntryAndExit?.absent} ຄົນ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='4'>
            <div className="dash-cardB">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg" >
                    <FontAwesomeIcon icon={faProjectDiagram} id="icon4" size="2x" />
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ໂປຣໂມຊັນ</b>
                  <div>{apolloDashboard?.dashBroad?.promotion} ໂປຣໂມຊັນ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='4'>
            <div className="dash-cardB">
              <Row>
                <Col md='3' className="dash-icon">
                  <div className="dash-icon-bg">
                    <FontAwesomeIcon icon={faUser} id="icon3" size="2x" style={{color:"#FF2B72"}}/>
                  </div>
                </Col>
                <Col md='9' className="dash-text">
                  <b>ລູກຄ້າໃໝ່</b>
                  <div>{apolloDashboard?.dashBroad?.newCustomer} ຄົນ</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md='4' style={{ marginTop: 24 }}>
            <div className="card bg-expends mb-3">
              <h4 className="card-header" style={{backgroundColor:"#ff4584",color:"white"}}>ລາຍຈ່າຍ</h4>
              <div className="card-body" style={{ marginLeft: -15, backgroundColor: "transparent", marginTop: -40, marginBottom: -8 }}>
                <Row>
                  <Col md="6" style={{ fontWeight: 700 }}>ລາຍຈ່າຍທັງໝົດ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.expenditure?.all}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ເງິນສົດ :</Col> <Col md="6">{apolloDashboard?.dashBroad?.expenditure?.cashTotal} ລາຍການ</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- LAK :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.cash?.lak)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- THB :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.cash?.thb)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- USD :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.cash?.usd)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- CNY :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.cash?.cny)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ເງິນໂອນ :</Col> <Col md="6"> {apolloDashboard?.dashBroad?.expenditure?.onlineTotal} ລາຍການ</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- LAK :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.online?.lak)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- THB :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.online?.thb)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- USD :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.online?.usd)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>- CNY :</Col> <Col md="6">{currency(apolloDashboard?.dashBroad?.expenditure?.online?.cny)}</Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col md='4' style={{ marginTop: 24 }}>
            <div className="card bg-income mb-3">
              <h4 className="card-header" style={{backgroundColor:"#8CD123",color:"white"}}>ລາຍຮັບ</h4>
              <div className="card-body" style={{ marginLeft: -15, backgroundColor: "transparent", marginTop: -40, marginBottom: -8 }}>

                <Row>
                  <Col md="6" style={{ fontWeight: 700 }}>ບໍລິການທັງໝົດ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.income?.all}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ບໍລິການລໍຖ້າ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.income?.waitingCheckout}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ບໍລິການສຳເລັດ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.income?.success}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ເງີນສົດ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.income?.cashTotal)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ເງີນໂອນ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.income?.onlineTotal)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ເງີນສົດ && ເງີນໂອນ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.income?.onlineAndCash)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ລວມເງີນທັ້ງໝົດ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.income?.cashTotal + apolloDashboard?.dashBroad?.income?.onlineTotal)}</Col>
                  {/* <Col md="6" style={{ fontWeight: 700 }}>ລວມເງີນທັ້ງໝົດ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.income?.all - apolloDashboard?.dashBroad?.income?.waitingCheckout}</Col> */}
                </Row>
              </div>
            </div>
          </Col>
          <Col md='4' style={{ marginTop: 24 }}>
            <div className="card bg-income mb-3">
              <h4 className="card-header" style={{backgroundColor:"blueviolet",color:"white"}}>tip</h4>
              <div className="card-body" style={{ marginLeft: -15, backgroundColor: "transparent", marginTop: -40, marginBottom: -8 }}>

                <Row>
                  <Col md="6" style={{ fontWeight: 700 }}>tip ເງີນສົດ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.tipCash)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>tip ເງີນໂອນ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.tipOnline)}</Col>
                  <Col md="6" style={{ fontWeight: 700 }}>ລວມເງີນທັ້ງໝົດ:</Col> <Col md="6"> {currency(apolloDashboard?.dashBroad?.tipCash + apolloDashboard?.dashBroad?.tipOnline)}</Col>
                  {/* <Col md="6" style={{ fontWeight: 700 }}>ລວມເງີນທັ້ງໝົດ:</Col> <Col md="6"> {apolloDashboard?.dashBroad?.income?.all - apolloDashboard?.dashBroad?.income?.waitingCheckout}</Col> */}
                </Row>
              </div>
            </div>
          </Col>
       
        </Row>

      </div>
    </div>
  );
}
