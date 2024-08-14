import React, { useEffect, useState } from "react";
import { CheckBox } from "devextreme-react/check-box";

export default function CustomCheckBox({
  checkboxvalue,
  id,
  toggleCheckbox,
  stagedChanges,
}) {
  //   const { SettingValues, stagedChanges, toggleCheckbox } = UseSettingContext();

  // Skeleton Loader
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (SettingValues) {
  //       setLoading(false);
  //     }
  //   }, [SettingValues]);

  return (
    <>
      {checkboxvalue.map((checkbox, index) => (
        <>
          <div className="custom-checkbox" key={index}>
            <CheckBox
              text={checkbox.value}
              value={stagedChanges && stagedChanges[id] === checkbox.id}
              onValueChange={() => toggleCheckbox(id, checkbox.id)}
              enableThreeStateBehavior={false}
              // readOnly={stagedChanges[id] === checkbox.id}
            />
          </div>
        </>
      ))}
    </>
  );
}
