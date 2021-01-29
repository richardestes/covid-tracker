import React from 'react'
import "./InfoBox.css"
import {Card, CardContent, Typography} from "@material-ui/core"

function InfoBox({title,cases,total,active,isRed,isBlue,isGreen,difference, ...props}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox
        ${active && 'infoBox--selected'}
        ${isRed && 'infoBox--red'}
        ${isBlue && 'infoBox--blue'}`}
    >
      <CardContent>
        <Typography className ="infoBox_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infoBox_cases ${isRed && "infoBox_cases--red"} ${isBlue && "infoBox_cases--blue"} ${isGreen && "infoBox_cases--green"}`}>
          {cases}
        </h2>
        <Typography className ="infoBox_total" color="textSecondary">
          {difference} compared to yesterday
          {difference==0 ? <p className="infoBox_data_warning">(If this is 0, today's data may have not been recorded yet)</p> : ""}
        </Typography>
        <Typography className ="infoBox_total" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
