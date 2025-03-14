import { Table, Progress } from "antd";

const dataSource = [
  {
    key: "1",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 4,
    success: 2,
    status: 50,
  },
  {
    key: "2",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 20,
    success: 20,
    status: 100,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "4",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "5",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "6",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "7",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "8",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "9",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "10",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "11",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
];

const columns = [
  {
    title: "#",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },

  {
    title: "Quantity Product",
    children: [
      {
        title: "Import",
        dataIndex: "import",
        key: "import",
      },
      {
        title: "Success",
        dataIndex: "success",
        key: "success",
      },
    ],
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: number) => (
      <div className="flex items-center">
        <Progress
          percent={status}
          size="small"
          status={status === 100 ? "success" : "active"}
          strokeColor={status < 50 ? "#FFA500" : undefined} // Màu cam nếu dưới 50%
        />
      </div>
    ),
  },

  {
    title: "",
    key: "action",
    render: () => (
      <a href="#" className="text-[#1D4AB1] flex justify-center items-center">
        Detail
      </a>
    ),
  },
];

export default function ManagerImport() {
  return (
    <div className="mt-8 bg-white shadow-sm rounded-2xl">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        components={{
          header: {
            cell: (props) => (
              <th {...props} className="text-black text-base font-bold" />
            ),
          },
        }}
      />
    </div>
  );
}
