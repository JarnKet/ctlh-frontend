
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from "@apollo/client";
/**
 * @Library
 */
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Component
 */
import { Form, Col, Row, Table, Spinner, Modal, Button, Breadcrumb } from 'react-bootstrap';
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
/**
 * @Constant
 */

import Routs from "../../consts/router";
/**
 * @Apollo
 */
import { GET_USERS } from '../../apollo/user/Query';
import { DELETE_USER } from '../../apollo/user/Mutation';

/**
 * @Function
 */
import { convertRole, dateTimeLao } from '../../helper/index'
import { customizeToast } from '../../helper/toast';
import PaginationHelper from '../../helper/PaginationHelper';
import { USER_KEY } from '../../consts';

export default function StaffList() {
  const history = useHistory();
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [usersData, setUsersData] = useState([]);
  const [totals, setTotals] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLoginData, setUserLoginData] = useState('')

  const getDataFromLocal = async () => {
    try {
      const _resData = await localStorage.getItem(USER_KEY)
      const _localJson = JSON.parse(_resData)
      
      if (_localJson?.data) {
        setUserLoginData(_localJson?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   *
   * @Apollo
   *
   */
  const [loadDataUsers, { data: apolloDaaUsers }] = useLazyQuery(GET_USERS, { fetchPolicy: "network-only" });
  const [deleteDataUser] = useMutation(DELETE_USER);
  /**
 *
 * @useEffect
 *
 */
  useEffect(() => {
    fetchUserData()
    getDataFromLocal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let _where = {}
    if (dataSearch !== "") _where = { ..._where, userId: dataSearch };
    if (phoneSearch !== "") _where = { ..._where, phone: phoneSearch };
    if (roleSearch !== "") {
        _where = { ..._where, role: roleSearch };
    }else {
        _where = { ..._where, roleAnd: ['ADMIN', 'STAFF_STOCK', 'STAFF', 'COUNTER', 'MANAGER_REPORT'] };
    }
    loadDataUsers({
      variables: {
        where: _where,
        skip: (_skip - 1) * _limit,
        limit: _limit,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch, phoneSearch, roleSearch]);

  useEffect(() => {
    if (apolloDaaUsers) { setUsersData(apolloDaaUsers?.users?.data); setTotals(apolloDaaUsers?.users?.total) }
  }, [apolloDaaUsers]);

  /**
   *
   * @Function
   *
   */

  const _historyPush = (context) => history.push(context, {role: "staff"})
  const _updateUsers = (e, item) => {
    e.stopPropagation()
    history.push(Routs.USER_EDIT + "/" + item, {role: "staff"});
  }

  const _deleteUser = (e, item) => { e.stopPropagation(); setShow(true); setUserId(item?.id) }
  const _confirmDeleteUser = async () => {
    try {
      const deleteUser = await deleteDataUser({ variables: { where: { id: userId } } });
      if(deleteUser?.data?.deleteUser?.id) {
        customizeToast("success", "ລຶບຜູ້ໃຊ້ລະບົບສຳເລັດ")
        loadDataUsers({
          variables: {
            where: {roleAnd: ['ADMIN', 'STAFF_STOCK', 'STAFF', 'COUNTER', 'MANAGER_REPORT']},
            skip: (_skip - 1) * _limit,
            limit: _limit,
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error) {
      customizeToast("error", "ເພີ່ມບໍ່ສຳເລັດ ກະລຸນາກວດຄືນ!")
    }
    setShow(false);
  }

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      await loadDataUsers({
        variables: {
            where: {roleAnd: ['ADMIN', 'STAFF_STOCK', 'STAFF', 'COUNTER', 'MANAGER_REPORT']},
          skip: (_skip - 1) * _limit,
          limit: _limit,
        }
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const _selectCodeForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກລະຫັດພະນັກງານແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  const _selectPhoneForCopy = (e, code) => {
    e.stopPropagation()
    customizeToast("success", "ຄັດລອກເບີໂທແລ້ວ")
    navigator.clipboard.writeText(code)
  }

  const handleClose = () => setShow(false);

  return (
    <div className="body">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>ຜູ້ໃຊ້ລະບົບ</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-title">
        <Row>
          <Col sm='4'>
            <Form.Group className="mb-4">
                <Form.Label>ຄົ້ນຫາ</Form.Label>
                <Form.Control type="type" placeholder="ລະຫັດພະນັກງານ" onChange={(e) => { setDataSearch(e.target.value) }} />
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className="mb-4">
              <Form.Label>ເບີໂທ</Form.Label>
              <Form.Control type="type" placeholder="ຄົ້ນຫາດ້ວຍເບີໂທ" onChange={(e) => setPhoneSearch(e.target.value)} />
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className="mb-3" >
              <Form.Label>ສິດການໃຊ້</Form.Label>
              <Form.Select onChange={(e) => { setRoleSearch(e.target.value) }}>
                <option value="">ທັງໝົດ</option>
                <option value="ADMIN">ແອັດມິນ</option>
                <option value="STAFF_STOCK">ພະນັກງານສາງ</option>
                <option value="STAFF">ຊ່າງ</option>
                <option value="COUNTER">ພະນັກງານເຄົ້າເຕີ້</option>
              </Form.Select>

            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <div className="card-body-title">
          <h4 className="text-primary"><b>ພະນັກງານ ({totals})</b></h4>
          {userLoginData?.role === 'ADMIN' ? 
            <button className="btn-primary-web" onClick={() => _historyPush(Routs.USER_ADD)}>+ ເພີ່ມຜູ້ໃຊ້</button>
            : <></>
          }
        </div>

        <div className="margin-top">
          {isLoading ? <div className='loading-page'><Spinner animation="border" variant="primary" /></div> :
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດພະນັກງານ</th>
                  <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                  <th>ເບີໂທ</th>
                  <th>ສິດການນຳໃຊ້</th>
                  <th>ວັນທີອັບເດດລ່າສຸດ</th>
                  {userLoginData?.role === 'ADMIN' ? 
                    <th>ຈັດການ</th>
                    : <></>
                  }
                </tr>
              </thead>
              {usersData?.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr onClick={() => _historyPush(Routs.USER_DETAIL + "/" + item?.id +  "/limit/10/skip/1" , {role: "staff"})}>
                      <td>{index + 1 + _limit * (_skip - 1)}</td>
                      <td>{item?.userId} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectCodeForCopy(e, item?.userId)} /></td>
                      <td>{item?.fullName}</td>
                      <td>{item?.phone} <FontAwesomeIcon icon={faCopy} className="icon-copy" onClick={(e) => _selectPhoneForCopy(e, item?.phone)} /></td>
                      <td>{convertRole(item?.role)}</td>
                      <td>{dateTimeLao(item?.updatedAt)} | {item?.createdBy?.fullName}</td>
                      {userLoginData?.role === 'ADMIN' ? 
                        <td>
                          <button className='btn-list-edit' onClick={(e) => _updateUsers(e, item?.id)}><FontAwesomeIcon icon={faEdit} /></button>
                          <button className='btn-list-delete' onClick={(e) => _deleteUser(e, item)}><FontAwesomeIcon icon={faTrash} /> </button>
                        </td>
                        : <></>
                      }
                    </tr>
                  </tbody>
                )
              })}
            </Table>}
          {Pagination_helper(totals, Routs.USER_LIST)}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ຢືນຢັນລຶບຜູ້ໃຊ້ລະບົບ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ຕ້ອງການລຶບຜູ້ໃຊ້ລະບົບນີ້ ຫຼື ບໍ່!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button className='bg-primary' onClick={() => _confirmDeleteUser()}>
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
