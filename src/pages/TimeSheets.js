import React, {useState, useEffect} from "react";
import {Alert, Table} from 'antd';

import TimeSheetService from "../services/timesheet.service";

const initialTimeSheetListState = [
    {
        "idTimeSheet": 0,
        "label": ""
    }
];

const TimeSheet = (props) => {
    const [TimeSheetList, setTimeSheetList] = useState(initialTimeSheetListState);
    const [error, setError] = useState(false);

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */

    useEffect(() => {
        getAllPrioritiesMethod();
    },);

    /** Service methods **/
    const getAllPrioritiesMethod = () => {
        TimeSheetService.getAll()
            .then(response => {
                setTimeSheetList(response.data);
                console.log(response.data);
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

    /** Handle actions in the Form **/

    /** General Methods **/
    const columns = [
        {
            title: 'TimeSheet',
            render: (TimeSheet) => TimeSheet.label
        }
    ];

    return (
        <div>
            <Table rowKey={TimeSheet => TimeSheetList.idTimeSheet} columns={columns} dataSource={TimeSheetList}/>
            {error ? (
                <Alert message="Error in the system. Try again later." type="error" showIcon closable/>
            ) : null}
        </div>
    )
};

export default TimeSheet;