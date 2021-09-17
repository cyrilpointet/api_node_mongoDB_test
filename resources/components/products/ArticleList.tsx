import React from "react";
import { Datagrid, List, TextField, EditButton } from "react-admin";

export const ArticleList: React.FunctionComponent = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="title" label="Titre" />
        <TextField source="content" label="Contenu" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
