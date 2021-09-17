import React from "react";
import { Show, SimpleForm, TextField } from "react-admin";

export const GroupEdit: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleForm>
        <TextField source="name" label="nom" />
      </SimpleForm>
    </Show>
  );
};
