import { Metadata } from "next";
import Form from "../_components/Form/Form";
export const metadata:Metadata={
    title:'Sign-In'
}

export default function page() {
    return (
        <Form />
    );
}
