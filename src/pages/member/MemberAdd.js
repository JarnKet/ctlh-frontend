import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import * as _ from "lodash";
import * as Yup from "yup";
import { Formik } from 'formik';
import UploadPhoto from "../../helper/UploadPhoto";
import { CREATE_USER } from "../../apollo/user/Mutation"
import { Breadcrumb, Row, Col, Form } from 'react-bootstrap';
import { ADDRESSES } from '../../consts/salavanProvince'
import 'react-toastify/dist/ReactToastify.css';
import Routs from "../../consts/router";
import { customizeToast } from '../../helper/toast';


export default function MemberAdd() {
    const history = useHistory();
    const [provincesName, setProvincesName] = useState("")
    const [districtsName, setDistrictsName] = useState("")
    const [districts, setDistricts] = useState([])
    const [villages, setVillages] = useState([])

    const [createMember] = useMutation(CREATE_USER);

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

    const SignupSchema = Yup.object().shape({
        fullName: Yup.string().required('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກ່ອນ! (ຕົວຢ່າງ: ບຸນມີ ຄຳປະສົງ)'),
        phone: Yup.string().min(10, 'ເບີໂທບໍ່ຄວນຕຳກວ່າ 10 ຕົວເລກ!').max(11, 'ເບີໂທບໍ່ຄວນຫຼາຍກວ່າ 11 ຕົວເລກ!').required('ກາລຸນາປ້ອນເບີກ່ອນ!'),
        // role: Yup.string().required('ກະລຸນາປ້ອນເລືອກສິດການນຳໃຊ້ກ່ອນ!'),
        // username: Yup.string().required('ກະລຸນາປ້ອນບັນຊີເຂົ້າສູ່ລະບົບ!'),
        password: Yup.string().required('ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ!'),
    });

    const { namePhoto, buttonUploadAndShowPhoto } = UploadPhoto();

    const onSubmitAddMember = async (newData) => {
        try {
            await createMember({
                variables: newData
            });
            customizeToast("success", "ເພີ່ມຂໍ້ມູນຜຸ້ໃຊ້ສຳເລັດ")
            history.push(Routs.MEMBER_LIST + '/limit/30/skip/1')
        } catch (error) {
            if (error.message === "USER_WITH_PHONE_IS_READY_EXIST")
                customizeToast("warning", "ມີເບີໂທນີ້ໃນລະບົບແລ້ວ!")
            else
                customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
        }
    }
    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => history.goBack()}>ສະມາຊິກຕົ້ມເຫຼົ້າ</Breadcrumb.Item>
                    <Breadcrumb.Item active>ເພີ່ມສະມາຊິກ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="card-add">
                <h4><b>ເພີ່ມສະມາຊິກຕົ້ມເຫຼົ້າ</b></h4>
                <hr />
                <div className="card-add-body">
                    <Formik
                        initialValues={{
                            fullName: "",
                            phone: "",
                            password: "",
                            memberAt: "",
                            note: "",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            onSubmitAddMember({
                                data: {
                                    ...values,
                                    username: values.phone,
                                    role: "MEMBER",
                                    profileImage: namePhoto,
                                    province: provincesName,
                                    district: districtsName
                                }
                            });
                        }}
                    >
                        {({ values, errors, handleChange, handleSubmit }) => (
                            <Row>
                                <Col sm="3">
                                    <h5><b>ອັບໂຫຼດຮູບພາບ</b></h5>
                                    {buttonUploadAndShowPhoto()}
                                </Col>

                                <Col sm="9">
                                    <div style={{ marginTop: 25 }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ຊື່ ແລະ ນາມສະກຸນ <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="fullName" onChange={handleChange} isInvalid={!!errors.fullName} value={values.fullName} />
                                            {errors.fullName ? (<div className="text-danger">{errors.fullName}</div>) : null}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ເບີໂທ<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" placeholder="20xxxxxxxx" name="phone" onChange={handleChange} isInvalid={!!errors.phone} value={values.phone} maxLength={11} pattern='[+-]?\d+(?:[.,]\d+)?' />
                                            {errors.phone ? <div className="text-danger">{errors.phone}</div> : null}
                                        </Form.Group>
                                        {/* <Form.Group className="mb-3">
                                            <Form.Label>ບັນຊີເຂົ້າສູ່ລະບົບ<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="username" onChange={handleChange} isInvalid={!!errors.username} value={values.username} />
                                            {errors.username ? <div className="text-danger">{errors.username}</div> : null}
                                        </Form.Group> */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>ລະຫັດ<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" placeholder="ກະລຸນາເພີ່ມ" name="password" onChange={handleChange} isInvalid={!!errors.password} value={values.password} />
                                            {errors.password ? <div className="text-danger">{errors.password}</div> : null}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ວັນທີ່ເປັນສະມາຊິກ<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="date" placeholder="ກະລຸນາເພີ່ມ" name="memberAt" onChange={handleChange} isInvalid={!!errors.memberAt} value={values.memberAt} />
                                        </Form.Group>
                                        {/* <Form.Group className="mb-3">
                                            <Form.Label>ເອກະສານແນບຄັດ<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="file" placeholder="ກະລຸນາເພີ່ມ" name="houseImage" onChange={handleChange} isInvalid={!!errors.houseImage} value={values.houseImage} />
                                            {errors.houseImage ? <div className="text-danger">{errors.houseImage}</div> : null}
                                        </Form.Group>
                                        <div className="dev-loading-file">
                                            <div className="loading-file"><div>ຊື່ຟາຍ.pdf</div> <span>x</span></div>
                                            <ProgressBar now={90} label={`${90}%`} />
                                            <div className="loading-file"><div>ຊື່ຟາຍ.pdf</div> <span>x</span></div>
                                            <ProgressBar now={60} label={`${60}%`} />
                                            <div className="loading-file"><div>ຊື່ຟາຍ.pdf</div> <span>x</span></div>
                                            <ProgressBar now={30} label={`${30}%`} />
                                        </div> */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>ແຂວງ<span className="text-danger">*</span></Form.Label>
                                            <Form.Select name='province' onChange={(e) => { handleChange(e); _selectProvince(e) }} isInvalid={!!errors.province} value={values.province}>
                                                {errors.province ? <div className="text-danger">{errors.province}</div> : null}

                                                {ADDRESSES?.provinces?.map((pro, index) => {
                                                    return (
                                                        <option key={index} value={pro?.pr_id}>{pro?.pr_name}</option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ເມືອງ<span className="text-danger">*</span></Form.Label>
                                            <Form.Select name='district' onChange={(e) => { handleChange(e); _selectDistrict(e) }} isInvalid={!!errors.district} value={values.district}>
                                                {errors.district ? <div className="text-danger">{errors.district}</div> : null}
                                                {districts?.map((dist, indexDist) => {
                                                    return (<option key={indexDist} value={dist?.dr_id} >{dist?.dr_name}</option>)
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ບ້ານ<span className="text-danger">*</span></Form.Label>
                                            <Form.Select name='village' onChange={handleChange} isInvalid={!!errors.village} value={values.village}>
                                                {errors.village ? <div className="text-danger">{errors.village}</div> : null}
                                                {villages?.map((village, position) => {
                                                    return (<option key={position} value={village?.vill_name} >{village?.vill_name}</option>)
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        {/* <Form.Group className="mb-3">
                                            <Form.Label>ກຸ່ມບ້ານ<span className="text-danger">*</span></Form.Label>
                                            <Form.Select >
                                                <option>Disabled select</option>
                                                <option>Disabled select</option>
                                                <option>Disabled select</option>
                                            </Form.Select>
                                        </Form.Group> */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>ໝາຍເຫດ</Form.Label>
                                            <Form.Control as="textarea" type="text" placeholder="ກະລຸນາເພີ່ມ" name="note" onChange={handleChange} value={values.note} />
                                        </Form.Group>
                                    </div>
                                    <div className="card-add-bottom">
                                        <button className="btn-cancel-web">ຍົກເລີກ</button>
                                        <button className="btn-confirm-web" onClick={handleSubmit}>ບັນທືກ</button>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}
