import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export const ArticleEdit: React.FunctionComponent = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" label="Titre" />
      <TextInput source="content" label="Description" />
    </SimpleForm>
  </Edit>
);
