import { Spacer, Modal, Input, Text, Button, Grid, Loading } from "@nextui-org/react";
import { useState } from "react";

export default function MakeNewModal({ 
    isModalVisible, 
    setIsModalVisible, 
    setRows,
    rows,
    form, 
    setForm, 
    isOpened,
    setIsOpened
    }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState("primary");
    const [saveButtonText, setSaveButtonText] = useState("Save");

    const textHandler = (e, name) => {
        let value = e.target.value;

        // convert date to date object
        if(name === "date") {
            value = new Date(value).getTime();
        }
        
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const submitForm = async () => {
        setErrorState("primary");

        let sendBody = {
            ...form,
        }
        // overwrite toUpdate which got carried over from form
        sendBody.toUpdate = isOpened;

        // add deleted prop, set to null
        sendBody.deleted = null;

        console.log("Sending:", sendBody);

        const response = await fetch(`api/send/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendBody)
        });

        const data = await response.json();

        if(data.success) {
            setIsModalVisible(false);
            setIsOpened(false);
            if(!isOpened) {
                // Append new Item to states
                const newItem = { name: data.name, port: data.port, _id: data._id }
                // append new item to rows and origData (for searching)
                setRows(prevState => [...prevState, newItem])
            } else {
                // modify item in rows and origData
                const updatedItem = form;

                const index = rows.findIndex(item => item._id === updatedItem._id);
                setRows(prevState => {
                    prevState[index] = updatedItem;
                    return [...prevState]
                })
            }
            
            setIsLoading(false);
            setSaveButtonText("Save");
        } else {
            console.log("Got error from fetch", data);
            setIsLoading(false);
            setErrorState("error");
            setSaveButtonText("Error! Try again");
        }
    }

    const deleteForm = async () => {

        const response = await fetch(`/api/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if(data.success) {
            setIsModalVisible(false);
            setIsOpened(false);
            //const newItem = { name: data.name, date: data.date, group: data.group, count: data.count, _id: data._id }
            // append new item to rows and origData (for searching)

            setRows(prevState => prevState.filter(item => item._id !== form._id))
            //setIsLoading(false);
        } else {
            console.log(data.error);
            //setIsLoading(false)
            setErrorState("error");
            setSaveButtonText("Error! Try again")
        }
    }


    const renderButton = isLoading ? <Loading size="sm" color="white" /> : saveButtonText

    return (
    <>
    <Modal blur closeButton open={isModalVisible} onClose={() => setIsModalVisible(false)} css={{background: "#00000075", backdropFilter:"blur(10px)"}} >
        <Modal.Header> <Text id="modal-title" size={18}>{form.name.length == 0 ? "Make new" : `Edit ${form.name}`}</Text></Modal.Header>

        <Modal.Body>
            <Spacer y={1} />
            <Input onChange={(e) => textHandler(e, "name" )} required underlined clearable labelPlaceholder='Name'  type="text"   initialValue={form.name}  />
            <Spacer  y={.25} />
            <Input onChange={(e) => textHandler(e, "port")} required underlined labelPlaceholder='Port' type="number" initialValue={form.port}  />

            <Modal.Footer>
                <Grid.Container gap={2} direction="row" justify="center">
                    <Grid>
                        <Button color={errorState} onClick={(e) => {submitForm(); setIsLoading(true)}}>{renderButton}</Button>
                    </Grid>
                    {isOpened ? (
                    <Grid>
                        <Button bordered color="error" onClick={(e) => deleteForm()}>Delete</Button>
                    </Grid>
                    ) : null}
                    <Grid>
                        <Button bordered color="warning" onClick={(e) => setIsModalVisible(false)}>Back</Button>
                    </Grid>
                </Grid.Container>
            </Modal.Footer>
        </Modal.Body>

    </Modal>
    </>
    )
}