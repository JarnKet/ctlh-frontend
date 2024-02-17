import React, { useEffect, useState } from 'react'

import { useLazyQuery } from "@apollo/client";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { Breadcrumb, Table } from "react-bootstrap";

import { currency, dateTimeLao } from "../../helper/index";
import { GET_ORDER_BILLS } from "../../apollo/bill/Query"
import { ConcertPayMethod, currencyFormat } from "../../consts/function";


export default function IncomeDetail() {
    const match = useRouteMatch();
    const history = useHistory();
    const location = useLocation();

    const [dataBills, setDataBills] = useState([]);
    const [total, setTotal] = useState(0);

    const [loadBills, { data: apolloBills }] = useLazyQuery(GET_ORDER_BILLS, { fetchPolicy: "network-only" });
    
    useEffect(() => {
        if(match?.params?.id) {
            loadBills({
                variables: {
                    where: { status: "CHECK_OUT", billId: match?.params?.id },
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match?.params?.id]);

    useEffect(() => {
        if (apolloBills) {
            setDataBills(apolloBills?.OrderBills?.data)
            setTotal(apolloBills?.OrderBills?.total)
        }
    }, [apolloBills])

    return (
        <>
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => history.goBack()}>
                        ລາຍການບິນ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>
                        ລາຍການບໍລິການ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>
                        {location?.state && location?.state?.numberTable ? 'ເລກບິນ ' + location?.state?.numberTable : '-'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='card-body'>
                <div className="card-body-title">
                    <h4 className="text-primary"><b>ລາຍການບໍລິການ ({currency(total)})</b></h4>
                </div>

                <Table striped className='mt-5'>
                    <thead>
                        <tr>
                            <th style={{ width: 100 }}>ລຳດັບ</th>
                            <th>ເລກບິນ</th>
                            <th>ຊື່ບໍລິການ</th>
                            <th>ລາຄາ</th>
                            <th>ສະກຸນເງິນ</th>
                            <th>ຊື່ລູກຄ້າ</th>
                            <th>ເບີໂທລູກຄ້າ</th>
                            <th>ພະນັກງານ</th>
                            <th>ວັນທີໃຊ້ບໍລິການ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataBills?.map((item, inx) => {
                            return (
                                <tr>
                                    <td>{inx + 1}</td>
                                    <td>{item?.billId?.numberTable}</td>
                                    <td>{item?.serviceId?.name}</td>
                                    <td>{currencyFormat(item?.amount)}</td>
                                    <td>{ConcertPayMethod(item?.billId?.paymentMethod)}</td>
                                    <td>{item?.billId?.customer?.fullName}</td>
                                    <td>{item?.billId?.customer?.phone}</td>
                                    <td>{item?.staff?.fullName}</td>
                                    <td>{dateTimeLao(item?.updatedAt)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </div>
        </>
    )
}
