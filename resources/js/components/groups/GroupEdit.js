import { Show, SimpleForm, TextField } from "react-admin";
import * as React from "react";

export const GroupEdit = (props) => {
  return (
    <Show {...props}>
      <SimpleForm>
        <TextField source="name" label="nom" />
      </SimpleForm>
    </Show>
  );
};
