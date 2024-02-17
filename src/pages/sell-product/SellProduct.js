import { useState } from "react";
import { Form, Col, Row, Breadcrumb, Table, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @HelperFunction
 */
import PaginationHelper from "../../helper/PaginationHelper";

/**
 * @Components
 */
import SaleItemCard from "../../components/SaleItemCard";

export default function SellProduct() {
  // Data
  const { _limit, _skip, Pagination_helper } = PaginationHelper();

  // Event Trigger
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            ສິນຄ້າທັງໝົດ
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title" style={{ marginTop: 10 }}>
        <Row>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ບາໂຄດ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ບາໂຄດສິນຄ້າ"
                onChange={(e) => {
                  //   setDataSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ຊຶ່ສິນຄ້າ</Form.Label>
              <Form.Control
                type="type"
                placeholder="ຄົ້ນຫາດ້ວຍຊຶ້ສິນຄ້າ"
                onChange={(e) => {
                  //   setPhoneSearch(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="mb-3">
              <Form.Label>ໝວດໝູ່</Form.Label>
              <Form.Select
                onChange={(e) => {
                  //   setCateSearch(e.target.value);
                }}
              >
                <option value="">ທັງໝົດ</option>
                <option value="ENTRY">1</option>
                <option value="EXIT">2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary">
            <b>ສິນຄ້າທັງໝົດ ({0})</b>
          </h4>
        </div>
        <div className="margin-top">
          {isLoading ? (
            <div className="loding-page">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="flexStart" style={{ gap: 26, flexWrap: "wrap" }}>
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
              <SaleItemCard />
            </div>
          )}
          <div style={{ marginTop: 20 }}>{Pagination_helper(30, "")}</div>
        </div>
      </div>
    </div>
  );
}
