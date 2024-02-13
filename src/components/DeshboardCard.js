import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { PRIMARY_COLOR } from "../consts";

function DeshboardCard({ total, title, icon, iconType }) {
    return (
        <div>
            <div className="card">
                <div className="card-step-all-title">
                    <p>{title ?? "-"}</p>
                </div>
                <div className="details-Ingredients">
                    <div className="numBers" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}> {total ?? 0} </div>
                    {iconType == "image" ? <img src={icon} alt="" width="50px" height="50px" /> : <FontAwesomeIcon icon={icon} fontSize="30px" />}
                </div>
                {/* <div className="card-detail">
                <div className="">ເບີ່ງລາຍລະອຽດ</div>
                <span className="icon-right">
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </div> */}
            </div>
        </div>
    );
}

export default DeshboardCard;
