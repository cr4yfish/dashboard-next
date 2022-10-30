import { Link } from "@nextui-org/react";
import { useState, useEffect } from "react"; 

const DynamicLink = ({ name, port }) => {
    const [hostname, setHostname] = useState("");

    useEffect(() => {
        setHostname(window.location.hostname);
    }, [])
    
    return (
        <Link href={`http://${hostname}:${port}`} target="_blank">
        {name}
        </Link>
    )
}

export default DynamicLink;