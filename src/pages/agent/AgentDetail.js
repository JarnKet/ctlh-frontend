import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

/**
 *
 * @Library
 */

import { Col, Row, Card, Button, Breadcrumb } from "react-bootstrap";
import { dateTimeLao } from "../../helper";

export default function AgentDetail() {
  const GET_AGENT_DETAIL = "http://localhost:8080/v1/api/shop-agent/";
  const S3_IMG_LINK = "https://ctlh-bucket.s3.ap-southeast-1.amazonaws.com/images/";

  const history = useHistory();
  const { id } = useParams();
  const [agentDetail, setAgentDetail] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgentDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(GET_AGENT_DETAIL + id);
        const responseData = await response.json();
        console.log(responseData.data);
        setAgentDetail(responseData.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchAgentDetail();
  }, [id]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push("/");
          }}
        >
          Agent
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{agentDetail?.shopName}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 20 }}>
        <Row>
          <Col md={4} className="flexCenter" style={{ alignItems: "flex-start", marginBottom: 10 }}>
            <Card style={{ width: "300px", height: 300, padding: 10 }}>
              {agentDetail?.shopOwner?.image ? (
                <img
                  src={S3_IMG_LINK + agentDetail?.shopOwner?.image}
                  alt="profile avatar"
                  width={"100%"}
                  height={200}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div>ບໍ່ມີຮູບພາບ</div>
              )}

              <h2 style={{ textAlign: "center", margin: "10px 0" }}>
                {agentDetail?.shopOwner?.firstName} {agentDetail?.shopOwner?.lastName}
              </h2>
              <small style={{ textAlign: "center", marginBottom: 10 }}>ວັນທີເພີ່ມ: {dateTimeLao(agentDetail?.createdAt)}</small>
              {/* <Button
                onClick={() => {
                  //   history.push(AGENT_EDIT + "/" + id);
                }}
              >
                ແກ້ໄຂ
              </Button> */}
            </Card>
          </Col>
          <Col md={8} className="flexCenter">
            <Card style={{ width: "90%", padding: 10 }}>
              <h2>ລາຍລະອຽດຂໍ້ມູນຕົວແທນ</h2>
              {/* ຂໍ້ມູນເຈົ້າຂອງຮ້ານ */}
              <div style={{ padding: 10, background: "var(--main2-color)", marginBottom: 10 }} className="flexBetween">
                <p>ຂໍ້ມູນເຈົ້າຂອງຮ້ານ</p>
                <Button>ແກ້ໄຂຂໍ້ມູນເຈົ້າຂອງຮ້ານ</Button>
              </div>
              <div className="flexBetween">
                <p className="">ລະຫັດຜູ້ໃຊ້:</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.userCode}</p>
              </div>
              <div className="flexBetween">
                <p className="">ຊຶ່ ແລະ ນາມສະກຸນ:</p>
                <p style={{ fontWeight: "bold" }}>
                  {agentDetail?.shopOwner?.firstName} {agentDetail?.shopOwner?.lastName}
                </p>
              </div>
              <div className="flexBetween">
                <p className="">ຊຶ່ຫຼິ້ນ:</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.nickName}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເພດ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.gender === "MALE" ? "ຊາຍ" : "ຍິງ"}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເບີໂທ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.phone}</p>
              </div>
              <div className="flexBetween">
                <p className="">ທີ່ຢູ່</p>
                <p style={{ fontWeight: "bold" }}>
                  ບ້ານ{agentDetail?.shopOwner?.village}, ເມືອງ{agentDetail?.shopOwner?.district}, {agentDetail?.shopOwner?.province}
                </p>
              </div>
              <div className="flexBetween">
                <p className="">Whatsapp</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.whatsapp || "-"}</p>
              </div>
              <div className="flexBetween">
                <p className="">Facebook</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.facebook || "-"}</p>
              </div>
              <div className="flexBetween">
                <p className="">Line</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.line || "-"}</p>
              </div>
              <div>
                <p className="">ໝາຍເຫດ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopOwner?.note || "-"}</p>
              </div>
              {/* ຂໍ້ມູນຮ້ານ */}
              <div style={{ padding: 10, background: "var(--main2-color)", marginBottom: 10 }} className="flexBetween">
                <p>ຂໍ້ມູນຮ້ານ</p>
                <Button>ແກ້ໄຂຂໍ້ມູນຮ້ານ</Button>
              </div>
              <div className="flexBetween">
                <p className="">ຊື່ຮ້ານ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopName}</p>
              </div>
              <div className="flexBetween">
                <p className="">ປະເພດຮ້ານ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopType?.name}</p>
              </div>
              <div className="flexBetween">
                <p className="">ເບີໂທ</p>
                <p style={{ fontWeight: "bold" }}>{agentDetail?.shopPhone}</p>
              </div>
              <div>
                <p className="">ຮູບພາບຮ້ານ</p>
                {agentDetail?.shopImage ? (
                  <img
                    src={S3_IMG_LINK + agentDetail?.shopImage}
                    alt="profile avatar"
                    width={"100%"}
                    height={200}
                    style={{ objectFit: "cover", margin: "10px 0" }}
                  />
                ) : (
                  <div>ບໍ່ມີຮູບພາບ</div>
                )}
              </div>
              <div className="flexBetween">
                <p className="">ຕັ້ງຢູ່ທີ່:</p>
                <p style={{ fontWeight: "bold" }}>
                  {agentDetail?.village}, {agentDetail?.district}, {agentDetail?.province}
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
