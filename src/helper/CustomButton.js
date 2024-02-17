import React, { Component } from 'react'
import Consts from '../consts'
import { FaEye, FaEdit, FaTrash, FaPlusCircle, FaPencilAlt } from "react-icons/fa";

/**
 *
 * @param {confirm} : show confirm
 * @param {addIcon} : show addIcon
 * @param {downloadIcon} : show downloadIcon
 */
function CustomButton({
  title,
  onClick,
  confirm,
  addIcon,
  addDelete,
  cancel,
  downloadIcon,
  editIcon,
  eyeIcon,
  width,
  style
}) {
  return (
    <button
      type='button '
      style={{
        backgroundColor: addIcon ? Consts.FRIST_COLOR : cancel ? Consts.THIRD_COLOR : addDelete ? '#D21C1C' : editIcon ? '#E8EDF1' :"#FFFFFF",
        color: addIcon ? "#ffffff" : cancel ? "#ffffff" : editIcon ? '#000000': "#ffffff",
        width: width || 140,
        height: 40,
        fontWeight: '700',
        border: cancel ? "1px solid #E8EDF1" :  '1px solid ' + Consts.FRIST_COLOR ,
        outline: 'none',
        borderRadius: 5,
        ...style
      }}
      onClick={() => onClick()}
    >
      {addIcon && <i className='fa fa-plus' />}{' '}
      {downloadIcon && <i className='fa fa-download' />} {title}
      {editIcon && <FaPencilAlt />}{' '}
      {eyeIcon && <i className='fa fa-eye' />}{' '}
      {addDelete && <FaTrash />} 
    </button>
  )
}

export default CustomButton
