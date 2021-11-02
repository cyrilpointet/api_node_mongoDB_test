import React from "react";
import {
  DateField,
  ImageField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export const FeedShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="type" label="Type" />
        <TextField source="story" label="Story" />
        <TextField source="message" label="Message" />
        <TextField source="pictureLink" label="picture link" />
        <ImageField source="pictureLink" label="picture" />
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <DateField source="updated" label="Updated at" locales="fr-FR" />
      </SimpleShowLayout>
    </Show>
  );
};
