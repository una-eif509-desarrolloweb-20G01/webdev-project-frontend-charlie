import React, { useState, useEffect } from "react";
import { Alert, Table, Form, Input, Button, Popconfirm } from "antd";
import FormItem from "antd/lib/form/FormItem";
import DepartamentService from "../services/deparment.service";

const initialDepartmentListState = [{ id: 0, nombre: "d" }];

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 3,
  },
};

const Departament = (props) => {
  let inputName = "";
  const [DepartmentList, setDeparmentList] = useState(
    initialDepartmentListState
  );
  const [form] = Form.useForm();
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
      getAllDepartmentsMethod();
  },[]);

  /** Service methods **/
  const getAllDepartmentsMethod = () => {
    DepartamentService.getAll()
      .then((response) => {
        setDeparmentList(response.data);
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

  const columns = [
    {
      title: "Id",
      render: (Department) => Department.id,
    },
    {
      title: "Nombre",
      render: (Department) => Department.nombre,
    },
    {
      title: 'Action',
      dataIndex: (Department) => Department.id,
      render: (Department, record) =>
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteDepartmentMethod(record.id)}>
            <a>Delete</a>
          </Popconfirm>
    },
  ];

  /** Handle actions in the Form **/

  const handleInputChange = (event) => {
    inputName = event.target.value;
  };
  const test = (id) => {
    console.log(id);
  };

  /** General Methods **/
  
  const saveDepartmentMethod = () => {
    let data = { 'nombre': inputName}
    DepartamentService.create(data)
      .then((response) => {
        console.log(response.data);
        setSaved(response.data);
        getAllDepartmentsMethod();
        onReset();
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
  const deleteDepartmentMethod = (id) => {
    console.log(id);
    DepartamentService.remove(id)
      .then((response) => {
        setDeleted(true);
        getAllDepartmentsMethod();
        onReset();
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

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <h2>Lista de Departamentos</h2>
      <Table rowKey={DepartmentList => DepartmentList.id} columns={columns} dataSource={DepartmentList} />
      <h2>Detalles de Departamentos</h2>
      <Form {...layout} form={form} name="control-hooks">
        <FormItem
          name="name"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input 
          name="name"
          onChange={handleInputChange}
          placeholder="Nombre del Departamento"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={saveDepartmentMethod}>
            Save
          </Button>
          <Button type="primary" onClick={onReset} danger>
            Cancel
          </Button>
        </FormItem>
      </Form>
      {error ? (
        <Alert
          message="Error in the system. Try again later."
          type="error"
          showIcon
          closable
        />
      ) : null}
      {saved ? (
        <Alert
          message="Saved Successfully"
          type="success"
          showIcon
          closable
        />
      ) : null}
      {deleted ? (
        <Alert
          message="Deleted Successfully"
          type="success"
          showIcon
          closable
        />
      ) : null}
    </div>
  );
};

export default Departament;
