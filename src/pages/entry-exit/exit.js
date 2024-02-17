import React, { useState, useEffect, createRef } from 'react';
import ReactSwipeButton from 'react-swipe-button'
import moment from "moment";
import { useHistory } from "react-router-dom";
import { calculateDistance } from './calculateLocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ToggleButton, ButtonGroup } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_ENTRY_AND_EXIT } from './apollo/mutation';
import { USER_KEY } from '../../consts';

export default function Exit() {
    const history = useHistory();
    const swipeButton = createRef();
    // const [isLoading, setIsLoading] = useState(false)
    // const [slideStatus, setSlideStatus] = useState(false)
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [locationDistance, setLocationDistance] = useState();
    const [type, setType] = useState("NORMAL");
    const [userData, setUserData] = useState({})
    const [createEntryAndExit] = useMutation(CREATE_ENTRY_AND_EXIT);

    useEffect(() => {
        getDataFromLocal()
        getCurrentLocationAndDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const getCurrentLocationAndDate = async () => {
        // setIsLoading(true)
        await navigator.geolocation.getCurrentPosition((position) => {
            // setIsLoading(true)
            const location = position.coords;

            setLatitude(location.latitude)
            setLongitude(location.longitude)

            const currentLocation = {
                latitude: location.latitude,
                longitude: location.longitude,
            };
            calculateLocation(currentLocation)

            setDateTime(new Date().toISOString())
            // setIsLoading(false)
        }, (error) => {
            console.error(error);
            // setIsLoading(false)
        });
        // setIsLoading(false)
    }

    const calculateLocation = async (currentLocation) => {
        const companyLocation = {
            latitude: 17.927201644219842,
            longitude: 102.61657492661115,
        };
        const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            companyLocation.latitude,
            companyLocation.longitude
        );
        const resultMetes = distance.toFixed(2)
        setLocationDistance(resultMetes)
    }

    const onSuccess = async () => {
        try {
            // setIsLoading(true)
            // setSlideStatus(true);
            let data = {
                latitude: latitude,
                longitude: longitude,
                locationDistance: locationDistance,
                displayTime: moment(dateTime).format("a ວັນdddd, ວັນທີ DD/MM/yyyy ເວລາ HH:mm"),
                day: moment().format('dddd'),
                digitalTime: dateTime,
                category: "EXIT",
                type: type,
                userId: userData["id"],
                userName: userData["userId"],
                phone: userData["phone"],
            }
            await createEntryAndExit({ variables: { data } })
            // setIsLoading(false)
        } catch (error) {
            console.log(error)
            // setIsLoading(false)
        }
    }

    return (
        <div style={{ marginLeft: -60, marginTop: -60, minHeight: '100vh', backgroundColor: '#fff' }}>
            <div className='header-bar'>
                <div onClick={() => history.goBack()} style={{ width: 50, height: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#fff" }} />
                </div>
                <div><b>ອອກຈາກບໍລິສັດ</b></div>
                <div style={{ width: 50, height: 50 }} />
            </div>
            <br />
            <br />
            {/* {(isLoading || !latitude) ? <Spinner animation="border" variant="primary" />
                :  */}
                <div style={{ display: "flex", flexDirection: "column", width: "100vw", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontSize: 17, fontWeight: "bold" }}>{moment(dateTime).format("a ວັນdddd, ວັນທີ DD/MM/yyyy ເວລາ HH:mm")}</p>
                    {/* <p>ຢູ່ຫ່າງຈາກບໍລິສັດ <b>{locationDistance} km</b></p> */}
                </div>
            {/* } */}
            <br />
            <br />
            <div style={{ width: "100vw", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "90vw", display: "flex", flexDirection: "column", alignSelf: "center" }}>
                    <ButtonGroup>
                        <ToggleButton
                            type="radio"
                            variant={"outline-danger"}
                            name="radio"
                            checked={type === "NORMAL"}
                            onClick={() => setType("NORMAL")}
                            style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                        >
                            ເລີກວຽກປົກກະຕິ
                        </ToggleButton>
                        <ToggleButton
                            type="radio"
                            variant={"outline-danger"}
                            name="radio"
                            checked={type === "OUTSIDE"}
                            onClick={() => setType("OUTSIDE")}
                        >
                            ອອກວຽກນອກ
                        </ToggleButton>
                    </ButtonGroup>
                    <br />
                    {/* <ReactSwipeButton color={"#f74e48"} text={"ອອກຈາກບໍລິສັດ"} text_unlocked={"ສຳເລັດ"} onSuccess={() => onSuccess()} ref={swipeButton} /> */}
                    {/* {locationDistance && locationDistance < 0.3 ?  */}
                    <ReactSwipeButton color={"#f74e48"} text={"ອອກຈາກບໍລິສັດ"} text_unlocked={"ສຳເລັດ"} onSuccess={() => onSuccess()} ref={swipeButton} />
                    {/* : <div style={{ width: "90vw", height: 50, backgroundColor: "#ebebeb", borderRadius: 50, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", overflow: "hidden" }}>
                            <div style={{ width: 50, height: 50, backgroundColor: "#c7c9c8", borderRadius: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <FontAwesomeIcon icon={faChevronRight} style={{ color: "#fff" }} />
                            </div>
                            <div style={{ color: "#818182" }}>ຈະເປີດໃຫ້ໃຊ້ໄດ້ເມື່ອຢູ່ບໍລິສັດ</div>
                            <div style={{ width: 50, height: 50 }} />
                        </div>} */}
                </div>
            </div>
        </div>
    )
}
