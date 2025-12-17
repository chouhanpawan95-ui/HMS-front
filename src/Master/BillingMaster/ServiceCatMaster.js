import { Container, Typography, TextField, Button } from "@mui/material";
import styles from "../../component/Container.module.css";
import {
  useGetServiceCategoryMasterQuery,
  useCreateServiceCategoryMasterMutation,
  useGetServiceDepartmentMasterQuery,
} from "../../features/api/Hooks/serviceApi";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../component/Loader";

const ServiceCatMaster = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { data: department = [] } = useGetServiceDepartmentMasterQuery();

  const {
    data: category,
    isLoading,
    refetch,
  } = useGetServiceCategoryMasterQuery(selectedDepartment);
  const [createCategory] = useCreateServiceCategoryMasterMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!selectedDepartment) {
      alert("Please select a department");
      return;
    }
    try {
      await createCategory({
        FK_DeptId: selectedDepartment,
        CategoryName: data.category,
      }).unwrap();

      reset();
      refetch();
    } catch (err) {
      console.error("Falied to add category: ", err);
      console.log("Api validation error message:", err.data);
      alert("backend error" + JSON.stringify(err.data));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        Service Category Master
      </Typography>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          select
          label="Select Department"
          SelectProps={{ native: true }}
          sx={{ width: "100%" }}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="" disabled>
            Select Department
          </option>

          {department.map((d) => (
            <option key={d._id} value={d._id}>
              {d.DeptName}
            </option>
          ))}
        </TextField>

        <TextField
          label="Category Name"
          sx={{ width: "100%", mt: 2 }}
          {...register("category", { required: "Category is required" })}
          error={!!errors.category}
          helperText={errors.category?.message}
        />

        <Button
          className={styles.button}
          type="submit"
          sx={{ width: "100%", mt: 2 }}
          variant="contained"
        >
          Save
        </Button>
      </form>
    </Container>
  );
};
export default ServiceCatMaster;
