
import DoctorList from "./DoctorList";
import BillType from "./BillType";
import CategoryList from "./CategoryList";

export default function ParentComponent() {
  return (
    <BillingInformation 
      doctorList={DoctorList}
      billTypeList={BillType}
      categoryList={CategoryList}
    />
  );
}
