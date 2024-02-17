import React, { Component } from 'react'
import Consts from '../consts'

/**
 *
 * @param {confirm} : show confirm
 * @param {addIcon} : show addIcon
 * @param {downloadIcon} : show downloadIcon
 */
function CustomButton({ title, onClick, confirm, addIcon, downloadIcon, editIcon, eyeIcon, width, style}) {
  return (
    <button
      type='button '
      style={{ backgroundColor: confirm ? "#254682" : '#fff', color: confirm ? '#fff' : "#254682", width: width || 140,
        height: 40, border: '1px solid #254682', outline: 'none', borderRadius: 5, ...style
      }}
      onClick={() => onClick()}
    >
      {addIcon && <i className='fa fa-plus' />}{' '}
      {downloadIcon && <i className='fa fa-download' />} {title}
      {editIcon && <i className='fa fa-edit' />}
      {eyeIcon && <i className='fa fa-eye' />}
    </button>
  )
}

export default CustomButton
