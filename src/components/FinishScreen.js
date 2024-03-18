import React from 'react'

function FinishScreen({points, totalPoints}) {
  const percentage = (points / totalPoints) * 100
  // let emoji;
  
  return (
    <p className='result'>
      You score <strong>{points}</strong> out of {totalPoints} ({Math.ceil(percentage)}%)
    </p>
  )
}

export default FinishScreen