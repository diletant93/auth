import { Metadata } from "next";
import SignUpForm from "../_components/Form/SignUpForm";
export const metadata:Metadata={
  title:'Sign-Up'
}
export default function page() {
  return (
    <SignUpForm/>
  );
}
