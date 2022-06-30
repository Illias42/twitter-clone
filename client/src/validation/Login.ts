import * as Yup from "yup";

export default Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid").max(40),
    password: Yup.string().required("Password is required").min(6)
});