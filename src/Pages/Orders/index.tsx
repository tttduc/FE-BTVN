import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
} from "antd";
import axios from "../../libraries/axiosClient";
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

const apiName = "/orders";

export default function Orders() {
  const [items, setItems] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPageSize(pageSize || 10);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Create Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Shipped Date",
      dataIndex: "shippedDate",
      key: "shippedDate",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Customers",
      dataIndex: "customer.fullName",
      key: "customer.fullName",
      render: (text, record, index) => {
        return (
          <span>
            {record.customer.lastName} {record.customer.firstName}
          </span>
        );
      },
    },
    {
      title: "Employees",
      dataIndex: "employee.fullName",
      key: "employee.fullName",
      render: (text, record, index) => {
        return (
          <span>
            {record.employee.lastName} {record.employee.firstName}
          </span>
        );
      },
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },

    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record.id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record.id);
                axios.delete(apiName + "/" + record.id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success("Xóa danh mục thành công!", 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Get products
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  // Get customers
  React.useEffect(() => {
    axios
      .get("/customers")
      .then((response) => {
        const { data } = response;
        setCustomers(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get employees
  React.useEffect(() => {
    axios
      .get("/employees")
      .then((response) => {
        const { data } = response;
        setEmployees(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //Get orders
  React.useEffect(() => {
    axios
      .get("/employees")
      .then((response) => {
        const { data } = response;
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onFinish = (values: any) => {
    console.log(values);

    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới danh mục thành công!", 1.5);
      })
      .catch((err) => {});
  };

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>Thêm danh mục</h1>
      <div style={{}}>
        {/* CREAT FORM */}
        <Form
          form={createForm}
          name="create-form"
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Khách hàng"
            name="customerId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={customers.map((c) => {
                return { value: c._id, label: c.lastName + " " + c.firstName };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhân viên"
            name="employeeId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={employees.map((c) => {
                return { value: c._id, label: c.lastName + " " + c.firstName };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentType"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Bắt buộc phải chọn",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdDate" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Ngày giao" name="shippedDate" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* TABLE */}
        <Table
          rowKey="_id"
          dataSource={items.slice((currentPage - 1) * 10, currentPage * 10)}
          columns={columns}
          pagination={false}
        />
        <Pagination
          style={{ paddingTop: "24px" }}
          total={items.length}
          current={currentPage}
          pageSize={10}
          onChange={handlePageChange}
        />

      {/* EDIT FORM */}

      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Khách hàng"
            name="customerId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={customers.map((c) => {
                return { value: c._id, label: c.lastName + " " + c.firstName };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhân viên"
            name="employeeId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={employees.map((c) => {
                return { value: c._id, label: c.lastName + " " + c.firstName };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentType"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdDate" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Ngày giao" name="shippedDate" hasFeedback>
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
