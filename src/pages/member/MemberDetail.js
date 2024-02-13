import React, {useEffect, useState} from 'react'
import { useHistory,useRouteMatch } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Breadcrumb, Row, Col,Spinner } from 'react-bootstrap';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { dateTimeLao } from '../../helper/index'
import Routs from "../../consts/router";
import Const from "../../consts/index";

import { GET_USER } from '../../apollo/user/Query';
// import { DELETE_USER } from '../../apollo/user/Mutation';

export default function MemberDetail() {
    const history = useHistory();
    const match = useRouteMatch();
    const [dataUser, setDataUser] = useState();

    const [loadDataUsers, { data: apolloDaaUsers, loading }] = useLazyQuery(GET_USER);
    useEffect(() => {
        loadDataUsers({ variables: { where: { id: match?.params?.id } } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match?.params?.id])

    useEffect(() => {
        if (apolloDaaUsers)
        setDataUser(apolloDaaUsers?.user)
        console.log('apolloDaaUsers: ', apolloDaaUsers?.user);
    }, [apolloDaaUsers])

    if (loading) return <div className='customLoading'> <Spinner animation="border" variant="primary" /> </div>

    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>ຜູ້ໃຊ້ລະບົບ</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>ບຸນກອງນອງພະຈັນ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="tap-custom">
                <div className="tap-top-bar-active">ຂໍ້ມູນທົ່ວໄປ</div>
                <div className="tap-top-bar" onClick={() => history.push(Routs.HISTORY_BOIL_ALCOHOL)}>ຂໍ້ມູນທົ່ວໄປ</div>
            </div>
            <div className="card-add">
                <div className="card-add-title">
                    <h4><b>ລາຍລະອຽດ</b></h4>
                    <div>
                        <button className="btn-edit" onClick={() => history.push(Routs.MEMBER_EDIT +"/"+ dataUser?.id)}><FontAwesomeIcon icon={faEdit} /> ແກ້ໄຂ</button>
                        <button className="btn-delete"><FontAwesomeIcon icon={faTrash} /> ລຶບ</button>
                    </div>
                </div>
                <hr />
                <div className="card-add-body">
                    <Row>
                        <Col sm="2">
                            <h5><b>ຮູບພາບ</b></h5>
                            {dataUser?.profileImage ? 
                            <img src={Const.URL_FOR_SHOW_PHOTO + dataUser?.profileImage} alt="" className="box-upload-image" />
                            : <img src="/assets/image/profile.png" className="box-upload-image" alt="" />}
                        </Col>
                        <Col sm="10">
                            <div style={{ marginTop: 25, marginBottom: 100 }}>
                                <Row>
                                    <Col sm="6">ສະມາຊິກ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.code}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຊື່ ແລະ ນາມສະກຸນ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.fullName}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຈຳນວນເຂົ້າທີ່ຍັງເຫຼືອ</Col>
                                    <Col sm="6" className="text-right text-danger">{dataUser?.amountRice ?? "0"} ກ.ກ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຈຳນວນແປ້ງທີ່ຍັງເຫຼືອ</Col>
                                    <Col sm="6" className="text-right text-danger">{dataUser?.amountFlour ?? "0"} ກ.ກ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ຈຳນວນເຫຼົ້າທີ່ຄົງຄ້າງ</Col>
                                    <Col sm="6" className="text-right text-danger">{dataUser?.amountDebtAlcohol ?? "0"} ກ.ກ</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ເບີໂທ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.phone}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ບັນຊີເຂົ້າສູ່ລະບົບ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.userName}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ລະຫັດຜ່ານ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.password}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ວັນທີເປັນສະມາຊິກ</Col>
                                    <Col sm="6" className="text-right">{dateTimeLao(dataUser?.memberAt)}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="12">ເອກະສານແນບຄັດ</Col>
                                    <Col sm="12" className="text-right">ຊື່ຟາຍ.pdf</Col>
                                    <Col sm="12" className="text-right">ຊື່ຟາຍ.pdf</Col>
                                    <Col sm="12" className="text-right">ຊື່ຟາຍ.pdf</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ແຂວງ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.province}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ເມືອງ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.district}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ບ້ານ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.village}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="6">ໝາຍເຫດ</Col>
                                    <Col sm="6" className="text-right">{dataUser?.note ?? "-"}</Col>
                                </Row>
                                <hr />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}
