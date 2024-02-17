import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**
 * @Component
 */
import { Modal } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
import { ADMIN_COLOR, URL_FOR_SHOW_PHOTO } from "../../consts";
/**
 * @Apollo
 */
import {
  EXPENDITURE,
  DELETE_EXPENDITURE,
} from "../../apollo/expenditure/Query";
import { ConcertPayMethod, formatDateDash } from "../../consts/function";
import { currency, dateTimeLao } from "../../helper";
import Swal from "sweetalert2";

export default function ExpenditureDetail() {
  const History = useHistory();
  const Params = useParams();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /**
   *
   * @Apollo
   *
   */
  const [loadDataUsers, { data: apolloDataExpenditure }] = useLazyQuery(
    EXPENDITURE,
    {
      variables: {
        where: {
          id: Params?.id,
        },
      },
    },
    { fetchPolicy: "network-only" }
  );
  /**
   *
   * @useEffect
   *
   */
  console.log("apolloDataExpenditure: ", apolloDataExpenditure?.expenditure);

  useEffect(() => {
    loadDataUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [DeleteFinnance] = useMutation(DELETE_EXPENDITURE);
  const _deleteFinance = async () => {
    const resCreateUser = await DeleteFinnance({
      variables: {
        where: { id: Params?.id },
      },
    });
    if (resCreateUser?.data?.deleteExpenditure?.id) {
      Swal.fire({
        icon: "success",
        title: "ການລົບສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      }).then(function () {
        handleClose()
        History.push(`${Routs.EXPENDITURE_LIST + "/" + Routs.PAGE_GINATION}`);
        window.location.reload(true);
      });
      handleClose()
    } else {
      Swal.fire({
        icon: "failed",
        title: "ການລົບບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="body">
      <div className="col-12">
        <div className="form-group" style={{ paddingLeft: 20, paddingTop: 20 }}>
          <h6>
            <span
              style={{ color: "#476FBC", cursor: "pointer" }}
              onClick={() =>
                History.push(
                  `${Routs.EXPENDITURE_LIST + "/" + Routs.PAGE_GINATION}`
                )
              }
            >
              ລາຍຈ່າຍ {">"}{" "}
            </span>
            {apolloDataExpenditure?.expenditure?.name}
          </h6>
        </div>
      </div>
      <div className="card-body">
        <p style={{ margin: 0, fontWeight: "bold" }}>ລາຍລະອຽດ</p>
        <div class="form-row" style={{ textAlign: "right" }}>
          <div class="col-12">
            <dvi class="form-group">
              &ensp;&ensp;
              <button
                className="btn btn col-1"
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                }}
                onClick={() => handleShow()}
              >
                <FontAwesomeIcon icon={faTrash} />
                &ensp;ລົບ
              </button>
            </dvi>
          </div>
        </div>
        <div style={{ height: 30 }}></div>
        <div class="form-row">
          <div class="col-12" style={{ backgroundColor: "#F1F1F1" }}>
            <div class="form-group" style={{ margin: 0 }}>
              <p style={{ fontSize: 18, fontWeight: "bold", margin: 5 }}>
                ຂໍ້ມູນທົ່ວໄປ
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 30 }}></div>
        <div class="form-row">
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຫົວຂໍ້</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p>{apolloDataExpenditure?.expenditure?.name}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ເລກທີ່ໃບບິນ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p>{apolloDataExpenditure?.expenditure?.billNumeber}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ປະເພດ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p>
                {" "}
                {
                  apolloDataExpenditure?.expenditure?.categoryExpenditureId
                    ?.name
                }
              </p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ວັນເດືອນປິ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p> {dateTimeLao(apolloDataExpenditure?.expenditure?.paydate)}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຜູ້ຮັບ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p> {apolloDataExpenditure?.expenditure?.payer ?? "-"}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຜູ້ຈ່າຍ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p> {apolloDataExpenditure?.expenditure?.createdBy?.fullName}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຈຳນວນເງິນ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p> {currency(apolloDataExpenditure?.expenditure?.amount)}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ສະກຸນເງິນ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p> {apolloDataExpenditure?.expenditure?.typeMoney}</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຊຳລະຜ່ານ</p>
            </div>
          </div>
          <div class="col-10">
            <div class="form-group">
              <p>
                {" "}
                {ConcertPayMethod(
                  apolloDataExpenditure?.expenditure?.paymentMethod
                )}
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 20 }}></div>
        <div class="form-row">
          <div class="col-12" style={{ backgroundColor: "#F1F1F1" }}>
            <div class="form-group" style={{ margin: 0 }}>
              <p style={{ fontSize: 18, fontWeight: "bold", margin: 5 }}>
                ຮູບພາບ
              </p>
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: 40 }}>
          <div style={{ height: 20 }}></div>
          <div class="form-row">
            <div class="col-12">
              <div class="form-group">
                <div className="row">
                  {apolloDataExpenditure?.expenditure?.images?.length <= 0
                    ? "-"
                    : apolloDataExpenditure?.expenditure?.images?.map(
                        (item) => (
                          <img
                            style={{ width: 220, height: 360, padding: 10 }}
                            src={URL_FOR_SHOW_PHOTO + item}
                            alt=""
                          />
                        )
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 20 }}></div>
        <div class="form-row">
          <div class="col-12" style={{ backgroundColor: "#F1F1F1" }}>
            <div class="form-group" style={{ margin: 0 }}>
              <p style={{ fontSize: 18, fontWeight: "bold", margin: 5 }}>
                ຄຳອະທິບາຍ
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 30 }}></div>
        <div class="form-row">
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090" }}>ຄຳອະທິບາຍ</p>
            </div>
          </div>
          <div class="col-3">
            <div class="form-group">
              <p>
                {" "}
                {apolloDataExpenditure?.expenditure.detail
                  ? apolloDataExpenditure?.expenditure.detail
                  : "-"}
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 80 }}></div>
        <div class="form-row">
          <div class="col-1">
            <div class="form-group">
              <p style={{ color: "#909090", fontWeight: "bold" }}>ສ້າງໂດຍ</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090", fontWeight: "bold" }}>
                {apolloDataExpenditure?.expenditure?.createdBy?.fullName}
              </p>
              <p style={{ color: "#909090", fontWeight: "bold" }}>
                {formatDateDash(apolloDataExpenditure?.expenditure?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="col-1">
            <div class="form-group">
              <p style={{ color: "#909090", fontWeight: "bold" }}>ອັບເດດໂດຍ</p>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <p style={{ color: "#909090", fontWeight: "bold" }}>
                {apolloDataExpenditure?.expenditure?.updatedBy?.firstName
                  ? apolloDataExpenditure?.expenditure?.updatedBy?.firstName
                  : "-"}
              </p>
              <p style={{ color: "#909090", fontWeight: "bold" }}>
                {formatDateDash(apolloDataExpenditure?.expenditure?.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} size="lg" centered onHide={handleClose}>
        <Modal.Body style={{ padding: 70 }}>
          <div style={{ fontSize: 28, fontWeight: "bold",textAlign:"center"  }}>
            ທ່ານຕ້ອງການລົບຂໍ້ມູນ
          </div>
          <div style={{ height: 20 }}></div>
          <div style={{ fontSize: 18, flexDirection: "row", display: "flex",justifyContent:"center"  }}>
            <p>ຂໍ້ມູນທັງໝົດຂອງ </p>
            <p style={{ color: "#2196F3", marginLeft: 10 }}>
              {apolloDataExpenditure?.expenditure?.billNumeber}
            </p>
            <p style={{ marginLeft: 10 }}> ຈະຖືກລົບທັງໝົດ</p>
          </div>
          <div style={{ height: 25 }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignContent: "centers",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => handleClose()}
              style={{ width: 200 }}
            >
              &nbsp; ຍົກເລີກ
            </button>
            <button
              className="btn"
              style={{
                marginLeft: 82,
                backgroundColor: ADMIN_COLOR,
                color: "#fff",
                width: 200 
              }}
              onClick={() => _deleteFinance()}
            >
              &nbsp; ຢືນຢັນ
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
