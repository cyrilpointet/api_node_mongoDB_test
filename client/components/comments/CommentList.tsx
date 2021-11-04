import React from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField,
} from "react-admin";

const getAuthorName = (comment): string => {
  return comment.author.name;
};

export const CommentList: React.FunctionComponent = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="message" label="Message" />
        <FunctionField
          label="Author"
          render={(comment) => getAuthorName(comment)}
        />
      </Datagrid>
    </List>
  );
};
