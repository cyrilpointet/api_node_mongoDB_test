import {Show, SimpleShowLayout, TextField} from "react-admin";
import * as React from "react";

export const MemberShow = props => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="name" label="nom" />
                <TextField source="email" label="email" />
            </SimpleShowLayout>
        </Show>
    )
}
