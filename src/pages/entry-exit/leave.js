import React, { useState, useEffect } from 'react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from "react-router-dom";
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { USER_KEY } from '../../consts';
import { CREATE_REQUEST_ABSENT } from './apollo/mutation';
import { useMutation } from '@apollo/client';

export default function LeavePage() {
    const history = useHistory();
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [description, setDescription] = useState("");
    // const [type, setType] = useState("DATE");
    const [startDate, setStartDate] = useState(moment().format("yyyy-MM-DD"));
    const [endDate, setEndDate] = useState(moment(moment()).format("yyyy-MM-DD"));
    const [startTime, setStartTime] = useState(moment().format("HH:mm"));
    const [endTime, setEndTime] = useState(moment(moment().add(4, "hours")).format("HH:mm"));
    const [createAbsent] = useMutation(CREATE_REQUEST_ABSENT);

    useEffect(() => {
        getDataFromLocal()
    }, [])

    const getDataFromLocal = async () => {
        try {
            const _resData = await localStorage.getItem(USER_KEY)
            const _localJson = JSON.parse(_resData)
            if (_localJson?.data) {
                setUserData(_localJson?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createRequestHoliday = async () => {
        try {
            setIsLoading(true)
            let data = {
                // type: type,
                description: description,
                startDate: startDate,
                endDate: endDate,
                status: "REQUESTING",
                startTime: moment(`${moment(startDate).format("yyyy-MM-DD")} ${startTime}`).format("yyyy-MM-DD HH:mm"),
                endTime: moment(`${moment(endDate).format("yyyy-MM-DD")} ${endTime}`).format("yyyy-MM-DD HH:mm"),
                userId: userData?.id,
                storeId: userData?.storeId?.id,
                note: userData?.userId,
            }
            await createAbsent({ variables: { data } })
            setIsLoading(false)
            history.goBack()
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <div style={{ marginLeft: 0, padding: 10, marginTop: -60, minHeight: '100vh', backgroundColor: '#fff' }}>
            <div className='header-bar'>
                <div onClick={() => history.goBack()} style={{ width: 50, height: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#fff" }} />
                </div>
                <div><b>ຂອບພັກວຽກ</b></div>
                <div style={{ width: 50, height: 50 }} />
            </div>
            <div style={{ padding: 10 }}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>ເຫດຜົນຂໍລາພັກ</Form.Label>
                    <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='ກະລຸນາປ້ອນເຫດຜົນຂໍລາພັກ...' rows={3} />
                </Form.Group>
                <hr />
                {/* <div>ຮູບແບບເວລາທີ່ຈະຂໍພັກ</div>
                <ButtonGroup style={{ width: "100%", marginTop: 10 }}>
                    <ToggleButton
                        type="radio"
                        variant={"outline-warning"}
                        name="radio"
                        checked={type == "TIME"}
                        onClick={() => setType("TIME")}
                        style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                    >
                        ພັກໃນລະດັບເວລາ
                    </ToggleButton>
                    <ToggleButton
                        type="radio"
                        variant={"outline-warning"}
                        name="radio"
                        checked={type == "DATE"}
                        onClick={() => setType("DATE")}
                    >
                        ພັກໃນລະດັບມື້
                    </ToggleButton>
                </ButtonGroup> */}
                <div style={{ marginTop: 10 }}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>ເລີ່ມວັນທີ</Form.Label>
                                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>ຫາວັນທີ</Form.Label>
                                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
                <div style={{ marginTop: 10 }}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>ເລີ່ມເວລາ</Form.Label>
                                <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>ຫາເວລາ</Form.Label>
                                <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
                <br />
                <br />
                <br />
                <Button variant={"primary"} style={{ width: "100%" }} disabled={isLoading} onClick={() => createRequestHoliday()} >{isLoading ? <Spinner as="span" animation="border" role="status" aria-hidden="true" /> : "ຢືນຢັນ"}</Button>
            </div>
        </div>
    )
}
