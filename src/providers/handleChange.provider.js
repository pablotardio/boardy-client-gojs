const handleChangeProvider=(e,form,setForm)=>{
    // const handleChange = (e) => {
    //     setForm({ ...form, [e.target.name]: e.target.value });
    // }
    setForm({ ...form, [e.target.name]: e.target.value });
}
export default handleChangeProvider;