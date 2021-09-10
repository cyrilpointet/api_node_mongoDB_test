import {Show, SimpleShowLayout, TextField} from "react-admin";
import * as React from "react";

export const GroupShow = props => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="name" label="nom" />
            </SimpleShowLayout>
        </Show>
    )
}
