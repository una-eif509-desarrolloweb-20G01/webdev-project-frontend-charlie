import React, { useState, useEffect } from "react";
import { Alert, Table, Form, Input, Button, Popconfirm } from "antd";
import DepartamentService from "../../services/department.service";
import './Department.css';
const initialDepartmentListState = [{ id: 0, nombre: "d" }];

const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 4,
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
  }, []);

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
      title: 'Delete',
      dataIndex: (Department) => Department.id,
      render: (Department, record) =>
        <Popconfirm title="Sure to delete?" onConfirm={() => deleteDepartmentMethod(record.id)}>
          <a>Delete</a>
        </Popconfirm>
    },
    {
      title: 'Update',
      dataIndex: (Department) => Department.id,
      render: (Department, record) =>
        <a onClick={() => updateDepartmentMethod(record.id)}>Update</a>
    },
  ];

  /** Handle actions in the Form **/

  const handleInputChange = (event) => {
    inputName = event.target.value;
  };

  /** General Methods **/

  const saveDepartmentMethod = () => {
    if (inputName.trim() === "") {
      alert("El nombre esta vacio o solo tiene espacios en blanco")
      setError(true)
    } else {
      let data = { 'nombre': inputName }
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
    }
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

  const updateDepartmentMethod = (id) => {
    if (inputName.trim() === "") {
      alert("El nombre esta vacio o solo tiene espacios en blanco")
      setError(true)
    } else {
      let data = { 'id': id, 'nombre': inputName }
      DepartamentService.update(data)
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
    }
  }

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <h2>Lista de Departamentos</h2>
      <Table rowKey={DepartmentList => DepartmentList.id} columns={columns} dataSource={DepartmentList} />
      <h2>Detalles de Departamentos</h2>
      <Form {...layout} form={form} name="control-hooks">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input
            name="name"
            onChange={handleInputChange}
            placeholder="Nombre del departamento"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={saveDepartmentMethod} id="save-btn">
            Save
          </Button>
          <Button type="primary" onClick={onReset} danger>
            Cancel
          </Button>
        </Form.Item>
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
