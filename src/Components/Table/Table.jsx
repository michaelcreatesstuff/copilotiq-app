import React from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import TableModal from './TableModal';

const tableColumns = [
  {
    title: 'Index',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (data) => (
      <>
        <div>{data[1]}</div>
        <Link to={data[0]}>
          <Button>View Profile</Button>
        </Link>
      </>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Profile Pic',
    dataIndex: 'profile_pic',
    key: 'profile_pic',
    render: (data) => <div>Asset ID: {data}</div>,
  },
  {
    title: 'Friends',
    dataIndex: 'friends',
    key: 'friends',
    render: (data) => (
      <>
        <b>{data?.length ? data?.length : 0} Friends:</b>
        {data?.length > 5 ? (
          <>
            {data?.slice(0, 5)?.map((a) => {
              return <div key={a.value}>{a.value}</div>;
            })}
            <TableModal title={`${data.length} Friends`} data={data} />
          </>
        ) : (
          <>
            {data?.map((a) => {
              return <div key={a.value}>{a.value}</div>;
            })}
          </>
        )}
      </>
    ),
  },
  {
    title: 'Recommendations',
    dataIndex: 'recommendations',
    key: 'recommendations',
    render: (data) => (
      <>
        <b>{data?.length ? data?.length : 0} Recommendations:</b>
        {data?.length > 5 ? (
          <>
            {data?.slice(0, 5)?.map((a) => {
              return <div key={a.value}>{a.value}</div>;
            })}
            <TableModal title={`${data.length} Recommendations`} data={data} />
          </>
        ) : (
          <>
            {data?.map((a) => {
              return <div key={a.value}>{a.value}</div>;
            })}
          </>
        )}
      </>
    ),
  },
];

const DataTable = ({ tableData }) => {
  return <Table dataSource={tableData} columns={tableColumns} />;
};

export default DataTable;
