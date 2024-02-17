import React from 'react'
import { faArrowRightToCity, faBriefcase, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from "react-router-dom";

export default function EntryExitHome() {
    const history = useHistory();
    
    // const _onLogout = () => {
    //     localStorage.clear()
    //     sessionStorage.clear()
    //     history.push(`/`)
    // }

    return (
        <div style={{ marginLeft: -60, marginTop: 60, padding: "20px 0", display: 'flex', flexDirection: "column", justifyContent: 'space-between', alignItems: "center", backgroundColor: "#FFF", minHeight: "92vh"}}>
            <div>
                <div onClick={() => history.push("entry")} className='btn-entry'>
                    <h3><b>ລົງຊື່ເຂົ້າ</b></h3>
                    <FontAwesomeIcon icon={faArrowRightToCity} style={{ fontSize: 40, color: "#fff" }} />
                </div>
                <br />
                <div onClick={() => history.push("exit")} className="btn-exit">
                    <h3><b>ລົງຊື່ອອກ</b></h3>
                    <FontAwesomeIcon icon={faDoorOpen} style={{ fontSize: 40, color: "#fff" }} />
                </div>
                <br />
                <div onClick={() => history.push("leave")} className="btn-leave">
                    <h3><b>ຂອບພັກວຽກ</b></h3>
                    <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: 40, color: "#fff" }} />
                </div>
            </div>
            {/* <p style={{color: "#fa412d", fontSize: 24}} onClick={() => _onLogout()}>ອອກຈາກລະບົບ</p> */}
        </div>
    )
}
