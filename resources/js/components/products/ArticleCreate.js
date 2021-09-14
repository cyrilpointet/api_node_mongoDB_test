import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput
} from 'react-admin';

export const ArticleCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" label="Titre" />
            <TextInput source="content" label="Contenu" />
        </SimpleForm>
    </Create>
);
