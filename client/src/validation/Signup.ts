import * as Yup from "yup";

export default Yup.object().shape({
    name: Yup.string().required("Name is required")
        .max(20, 'Name must not exceed 20 characters'),
    surname: Yup.string().required("Surname is required")
        .max(20, 'Surname must not exceed 20 characters'),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Email is required"),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
});