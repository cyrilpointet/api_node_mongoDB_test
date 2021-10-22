import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export const GroupEdit: React.FunctionComponent = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" label="nom" />
      </SimpleForm>
    </Edit>
  );
};
