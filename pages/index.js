import Head from 'next/head'
import { Container, Card, Tooltip, 
  Button, Grid, Spacer, Text, 
  Table, Link, Loading, Row,
  Col
} from "@nextui-org/react";
import * as React from 'react';
import { MdEdit, MdAdd } from "react-icons/md";

import MakeNewModal from '../components/MakeNewModal';

const Home = ({ data }) => {
  const [form, setForm] = React.useState({
    name: "",
    port: 0,
  });
  const [rows, setRows] = React.useState(data);
  const [isLoading, setisLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isOpened, setIsOpened] = React.useState(false);

  const columns = [
    {
      label: 'NAME',
      key: 'name',
    },
    {
      label: "PORT",
      key: "port"
    },
    {
      label: "ACTIONS",
      key: "actions"
    }
  ]

  const EditButton = ({ _id }) => {
    return (
        <Button
          auto
          ghost
          rounded
          color="warning"
        >
          <MdEdit onClick={() => editItem(_id)}/>
        </Button>
    )
  }

  const editItem = (_id ) => {
    const selectedEle = rows.find(item => item._id == _id);
    setForm(selectedEle);
    setIsOpened(true);
    setIsModalVisible(true);
  }

  const renderCell = (row, columnKey) => {
    const cellValue = row[columnKey];

    switch(columnKey) {
      case 'name':
        return (
          <Link href={`http://192.168.0.100:${row.port}`} target="_blank">
            {cellValue}
          </Link>
        )
      case 'port':
        return (
          <>{cellValue}</>
        )
      case 'actions':
        return (
          <EditButton _id={row._id} />
        )
    }
  }

  const addItem = async () => {
    setisLoading(true);
    setIsModalVisible(true);
    setisLoading(false);
  }
  
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard next" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MakeNewModal 
        isModalVisible={isModalVisible} 
        setIsModalVisible={setIsModalVisible}
        isOpened={isOpened} 
        setIsOpened={setIsOpened}
        rows={rows} 
        setRows={setRows}
        form={form}
        setForm={setForm}
      />

        <Button
          onClick={() => addItem()}
          color="success"
          auto
          css={{
            position: "absolute",
            right: "40px",
            bottom: "40px"
          }}
        >{isLoading ? <Loading /> : <MdAdd size={30} />}</Button>
      
      <Container>
        <Spacer />
        <Table
          selectionMode='single'
          aria-label="Example table with dynamic content" >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column 
              key={column.key}
              hideHeader={column.key === "actions"}
              align={column.key === "actions" ? "center" : "start"}
              >
              {column.label}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows}>
            {(item) => (
              <Table.Row key={item.port}>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>

    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:39999/api/get`);
  let data = await res.json();

  if(data.length == 0) {
    return { props: { data: [] } }
  }

  // filter out deleted items
  data = data.filter((ele) => ele.deleted === null);

  return { props: {data} };
}

export default Home;
