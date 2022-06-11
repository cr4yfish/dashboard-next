import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid, Spacer, Text, Table, Link } from "@nextui-org/react";

export default function Home() {
  
  const columns = [
    {
      label: 'NAME',
      key: 'name',
    },
    {
      label: "PORT",
      key: "port"
    }
  ]

  const rows = [
    {
      key: "1",
      name: "Food Tracker",
      port: 30010
    },
    {
      key: "2",
      name: "Z2m Dashboard",
      port: 30006
    },
    {
      key: "3",
      name: "Work Tracker",
      port: 30006
    }
  ]

  const renderCell = (row, columnKey) => {
    const cellValue = row[columnKey];

    switch(columnKey) {
      case 'name':
        return (
          <Link href={`/`} onClick={`javascript:event.target.port=${row.port}`}>
            {cellValue}
          </Link>
        )
      case 'port':
        return (
          cellValue
        )
    }
  }
  
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard next" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Text h1>Dashboard next</Text>
        <Table
          selectionMode='single'
          aria-label="Example table with dynamic content" >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.key}>{column.label}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows}>
            {(item) => (
              <Table.Row key={item.key}>
                {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>

    </div>
  )
}
