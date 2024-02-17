import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";

import { Form, Col, Row, Breadcrumb, Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { customizeToast } from '../../helper/toast';
import { CREATE_DUTY, GET_DUTYS } from '../../apollo/duty';
import { formateDateSlashDDMMYY } from '../../common';

export default function DutyList() {
  const [dataDuty, setDataDuty] = useState([]);
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const [loadDataDuty, { data: apolloDataDuty }] = useLazyQuery(GET_DUTYS, { fetchPolicy: "network-only" });
  const [createDuty] = useMutation(CREATE_DUTY);

  useEffect(() => {
    fetchDuty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (apolloDataDuty) {
      setDataDuty(apolloDataDuty?.duties?.data);
    }
  }, [apolloDataDuty])

  const fetchDuty = async () => {
    try {
      setIsLoading(true)
      await loadDataDuty();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  /**
   * 
   * @Function
   * 
   */
  const handleAmountChange = evt => {
    const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/

    if (rx_live.test(evt.target.value)) {
      setAmount(evt.target.value)
    }
  }
  const _save = async () => {
    try {
      await createDuty({
        variables: { data: { 
          name: "",
          amount: parseInt(amount)
        }}
      });
      fetchDuty();
      setAmount('')
      customizeToast("success", "ເພີ່ມຂໍ້ມູນສຳເລັດ");
    } catch (error) {
      console.log('error: ', error);
      customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
  }

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ອ.ມ.ພ</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-body">
        <Row>
          <Col md={10}>
              <Form.Control type="text" maxLength={2} style={{height: 44}} placeholder="ກະລຸນາເພີ່ມຈຳນວນ ອາກອນມູນຄ່າເພີ່ມ" name="amount" onChange={handleAmountChange}  value={amount} />
          </Col>
          <Col md={1}>
            <button className="btn-primary-web"onClick={() => _save()}>+ ເພີ່ມ</button>
          </Col>
        </Row>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ອ.ມ.ພ</th>
                  <th>ວັນທີສ້າງ</th>
                </tr>
              </thead>
              <tbody>
              {dataDuty?.map((item, index) => {
                return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item?.amount + " %"}
                        {index === 0 ? <span className='text-success ml-2'><FontAwesomeIcon icon={faCheck} />ກຳລັງໃຊ້ຢູ່</span> : ''}
                      </td>
                      <td>{formateDateSlashDDMMYY(item?.createdAt)}</td>
                    </tr>
                )
              })}
              </tbody>
            </Table>
          }
        </div>
      </div>
    </div>
  )
}
