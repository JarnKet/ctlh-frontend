import React, { useRef } from "react";
import { currency, toDayDash } from "../../helper";
import ReactToPrint from "react-to-print";
import { Col, Image, Row } from "react-bootstrap";

export default function PrintBillCourse({ data, amount, allDiscount, promotion, finalAmount, dutyPrice, dutyPercent }) {
  const componentRef = useRef();
  return (
    <div className="d-none">
      <div className="print-bill-content" ref={componentRef}>
        <div style={{ padding: 10 }}>
          <div style={{ textAlign: "center" }}>
            <Image
              src={process.env.PUBLIC_URL + "/assets/image/logo-print.jpeg"}
              style={{
                height: 100,
                width: 100,
                borderRadius: "10%",
                border: "1px solid #000",
                fontWeight: "bold",
              }}
            />
          </div>
          <div className="text-store-name" style={{ textAlign: "center" }}>
            ຮ້ານທິດາ ສາຂາທົ່ງສາງນາງ
          </div>
          <div
            style={{
              borderBottom: '2px solid #000',
              margin: '8px 0'
            }}
          />
        <div>
            <div style={{ textAlign: "start" }}>
                ເບີໂທ: 020 9994 5595
            </div>
            <div style={{ textAlign: "start" }}>
                ລະຫັດບີນ: {data && data[0]?.billId?.numberTable}
            </div>
            <div style={{ textAlign: "start" }}>
                ຊື່ລູກຄ້າ: {data && data[0]?.billId?.customer?.fullName ? data[0]?.billId?.customer?.fullName : "-"}
            </div>
            <div style={{ textAlign: "start" }}>
                ວັນທີ: {data && toDayDash(data[0]?.updatedAt)}
            </div>
        </div>
          <div
            style={{
              borderBottom: '2px solid #000',
              margin: '8px 0'
            }}
          />
          <Row>
            <Col>
              <span>ລາຍການບໍລິການ</span>
            </Col>
            <Col className="text-end">
              <span>ລາຄາ</span>
            </Col>
          </Row>
          <div style={{ height: 10 }}></div>
          <Row>
            <Col>
                <span>
                {data?.length > 0 ? data[0]?.serviceId?.name : ''}
                </span>
            </Col>
            <Col className="text-end">
                <span>
                    {console.log(data)}
                {data?.length > 0 ? currency(amount) : ''} ກີບ
                </span>
            </Col>
            </Row>
          <div
            style={{
              borderBottom: '2px solid #000',
              margin: '8px 0'
            }}
          />
          <Row>
            <Col>
              <span>ລວມ:</span>
            </Col>
            <Col className="text-end">
              <span>{currency(amount)} ກີບ</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>ໂປຣໂມຊັ່ນ:</span>
            </Col>
            <Col className="text-end">
              <span>+ {currency(promotion)} ກີບ</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>ອ.ມ.ພ {dutyPercent} %:</span>
            </Col>
            <Col className="text-end">
              <span>+ {currency(dutyPrice)} ກີບ</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>ສ່ວນຫຼຸດ:</span>
            </Col>
            <Col className="text-end">
              <span>- {allDiscount ? currency(allDiscount) : 0} ກີບ</span>
            </Col>
          </Row>

          <div
            style={{
              borderBottom: '2px solid #000',
              margin: '8px 0'
            }}
          />

          <Row>
            <Col>
              <span>ເງິນທີ່ຊຳລະ:</span>
            </Col>
            <Col className="text-end">
              <span>{currency(finalAmount)} ກີບ</span>
            </Col>
          </Row>
        </div>

        <div className="text-center py-2">ຂອບໃຈທີ່ໃຊ້ບໍລິການ</div>
      </div>
      <div className="text-center">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary ml-3" id="btn-auto-click">
              ສັ່ງພີມ
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
}
