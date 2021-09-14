import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput
} from 'react-admin';

export const ArticleEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" label="Titre" />
            <TextInput source="content" label="Description" />
        </SimpleForm>
    </Edit>
);
