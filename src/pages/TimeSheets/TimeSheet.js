import React, { useState, useEffect } from "react";
import { Alert, Table} from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import TimeSheetService from "../../services/timesheet.service";

const initialPriorityListState = [
  {
    "id": 0,
    "name": "",
    "hours": 0
  }
];

const TimeSheet = (props) => {
  const [timeSheetList, setTimeSheetList] = useState(initialPriorityListState);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllThimeSheetsMethod();
  });

  /** Service methods **/
  const getAllThimeSheetsMethod = () => {
    TimeSheetService.getAll()
      .then(response => {
        sumTimeSheetHours(response);
      })
      .catch(err => {
        console.log(err);
        setError(err)
        if (err.response.status === 401) {
          props.history.push("/login");
          window.location.reload();
        }
      });
  }


  const timeSheetDetails = (id) => {
    props.history.push(`/timeSheetDetails/${id}`);
  }

  const sumTimeSheetHours = (response) => {
    let array = [];
    let sum = 0;
    response.data.forEach(element => {
      let timeSheet = {
        "id": element.id,
        "name": element.name,
        "hours": 0
      }
      sum = 0;
      element.timeRecordList.forEach((element) => {
        sum += element.fridayHours;
        sum += element.mondayHours;
        sum += element.saturdayHours;
        sum += element.sundayHours;
        sum += element.thursdayHours;
        sum += element.tuesdayHours;
        sum += element.wednesdayHours;
      });
      timeSheet.hours = sum;
      array.push(timeSheet)
    });
    setTimeSheetList(array);
  }

  const columns = [
    {
      title: 'Id',
      render: (timesheet) => timesheet.id,
      width: '20%',
    },
    {
      title: 'Name',
      render: (timesheet) => timesheet.name,
      width: '20%',
    },
    {
      title: 'Hours',
      render: (timesheet) => timesheet.hours,
      width: '20%',
    },
    {
      title: 'Details',
      dataIndex: (timesheet) => timesheet.id,
      render: (timesheet, element) =>
      <EyeOutlined onClick={() => timeSheetDetails(element.id)} />
      
    }
  ];

  return (
    <div>

      <h1>Time Sheet</h1>
      <Table rowKey={timeSheetList => timeSheetList.id} columns={columns} dataSource={timeSheetList} />
      {error ? (
        <Alert message="Error in the system. Try again later." type="error" showIcon closable />
      ) : null}
    </div>
  )
};

export default TimeSheet;