import React from 'react'
import Consts from '../consts'

const Title = ({text}) => {
  return (
    <div style={{fontSize: 18, color: Consts.SECONDARY_COLOR,fontWeight:'400',marginTop:5,marginBottom:5}}>
      {text}
    </div>
  )
}

export default Title
