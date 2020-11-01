import React,  { useState, useEffect } from "react";
import { Button, Popconfirm } from "antd";
import TimeSheetService from "../../services/timesheet.service";
import DepartamentService from "../../services/department.service";

const initialTimeSheetDetailsState = [{ id: 0, name: "d",  "timeRecordList": []}];
const initialDepartmentListState = {"id":0,"nombre":"Test"};

const TimeSheetDetails = (props) => {
    const [TimeSheetDetails, setTimeSheetDetails] = useState(initialTimeSheetDetailsState);
    const [Department, setDeparment] = useState(initialDepartmentListState);
    const [totalHours, setTotalHours] = useState(0);
    const [error, setError] = useState(false);
    let departmentId = '';

    useEffect(() => {
      // TODO: agregar el id que viene de la lista de timesheets
        getTimeSheetDetailsMethod(props.match.params.id);
    }, []);

    /** Service Methods */
    const getTimeSheetDetailsMethod = (id) => {
      TimeSheetService.get(id)
        .then((response) => {
          let sum = 0;
          setTimeSheetDetails(response.data);
          response.data.timeRecordList.forEach((element) => {
            sum += element.fridayHours;
            sum += element.mondayHours;
            sum += element.saturdayHours;
            sum += element.sundayHours;
            sum += element.thursdayHours;
            sum += element.tuesdayHours;
            sum += element.wednesdayHours;
          });
          setTotalHours(sum);
          console.log(response.data);
          departmentId = response.data.timeRecordList[0].departmentId;
          getDeparmentFromTimeSheet(departmentId);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          // if (err.response.status === 401) {
          //   props.history.push("/login");
          //   window.location.reload();
          // }
        });
    };

    const getDeparmentFromTimeSheet = (id) => {
      DepartamentService.get(id)
        .then((response) => {
          setDeparment(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          if (err.response.status === 401) {
            props.history.push("/login");
            window.location.reload();
          }
        });
    };

    const deleteTimeSheet = () => {
      let id = TimeSheetDetails.id
      console.log(id);
      TimeSheetService.remove(id)
        .then((response) => {
          props.history.push("/timeSheet");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          if (err.response.status === 401) {
            props.history.push("/login");
            window.location.reload();
          }
        });
    };

    /** General Methods */
    
    return (
        <div>
            <h2>Detalles del TimeSheet</h2>
            <p id="timeSheetName">
            <b>Nombre: </b>
            {TimeSheetDetails.name}
            </p>
            <p id="timeSheetHours">
            <b>Total de Horas: </b>
            {totalHours} horas
            </p>
            <p>
            <b>Departamento: </b>
            {Department.nombre}
            </p>
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteTimeSheet()}>
              <Button type="primary" danger>
                Eliminar TimeSheet
              </Button>
            </Popconfirm>
        </div>
    )

}

export default TimeSheetDetails;