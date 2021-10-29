import React from "react";
import { Datagrid, DateField, List, TextField, ImageField } from "react-admin";

export const FeedList: React.FunctionComponent = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="type" label="Type" />
        <TextField source="story" label="Story" />
        <TextField source="message" label="Message" />
        <ImageField source="pictureLink" label="picture link" />
      </Datagrid>
    </List>
  );
};
