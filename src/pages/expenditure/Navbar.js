import React from "react";
import { useHistory,useLocation,useParams } from "react-router-dom";
import { Nav } from "react-bootstrap";
import {
  INCOME_LIST,
  EXPENDITURE_LIST,
  EXPENDITURE_CATEGORY,
  PAGE_GINATION
} from "../../consts/router";
export default function Navbar() {
  const history = useHistory();
  const location = useLocation();
  const Params = useParams();
  const _historyPaymentList = (routpath) => {
    history.push(routpath+"/"+ PAGE_GINATION);
  };
  return (
    <div>
      <div style={{ paddingLeft: 19 }}>
        <Nav
          variant="tabs"
          style={{ fontWeight: "bold" }}
          defaultActiveKey={location?.pathname}
        >
          <Nav.Item>
            <Nav.Link
              eventKey={ location?.pathname ===INCOME_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/' ? INCOME_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/':INCOME_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip}
              onClick={() => _historyPaymentList(INCOME_LIST)}
              style={{ color: "#476FBC" }}
            >
              ລາຍຮັບ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey={ location?.pathname ===EXPENDITURE_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/' ? EXPENDITURE_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/':EXPENDITURE_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip}
              onClick={() => _historyPaymentList(EXPENDITURE_LIST)}
              style={{ color: "#476FBC" }}
            >
              ລາຍຈ່າຍ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey={ location?.pathname ===EXPENDITURE_CATEGORY+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/' ? EXPENDITURE_CATEGORY+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/':EXPENDITURE_CATEGORY+"/limit/"+ Params?.limit+"/skip/"+Params?.skip}
              onClick={() => _historyPaymentList(EXPENDITURE_CATEGORY)}
              style={{ color: "#476FBC" }}
            >
              ໝວດລາຍຈ່າຍ
            </Nav.Link>
          </Nav.Item>
        </Nav>
        </div>
    </div>
  );
}
