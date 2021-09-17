import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

export const ArticleCreate: React.FunctionComponent = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" label="Titre" />
      <TextInput source="content" label="Contenu" />
    </SimpleForm>
  </Create>
);
