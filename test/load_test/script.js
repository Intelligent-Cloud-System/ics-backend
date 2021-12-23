/*
 * ICS
 * Intelligent file storage
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://github.com/OpenAPITools/openapi-generator
 *
 * OpenAPI generator version: 5.3.1
 */


import http from "k6/http";
import { group, check, sleep } from "k6";

const BASE_URL = "http://127.0.0.1:5000";
// Sleep duration between successive requests.
// You might want to edit the value of this variable or remove calls to the sleep function on the script.
const SLEEP_DURATION = 0.1;
// Global variables should be initialized.

export default function() {
    // TODO: Dima
    group("/files/download/{fileLink}", () => {
        let fileLink = 'TODO_EDIT_THE_FILELINK'; // specify value as there is no example value for this parameter in OpenAPI spec
        let iv = 'TODO_EDIT_THE_IV'; // specify value as there is no example value for this parameter in OpenAPI spec

        // Request No. 1
        {
            let url = BASE_URL + `/files/download/${fileLink}?iv=${iv}`;
            let request = http.get(url);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

    // TODO: Andriy
    group("/users/current", () => {

        // Request No. 1
        {
            let url = BASE_URL + `/users/current`;
            let request = http.get(url);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

    // TODO: Maks
    group("/files/upload", () => {

        // Request No. 1
        {
            let url = BASE_URL + `/files/upload`;
            // TODO: edit the parameters of the request body.
            let body = {"file": http.file(open("/path/to/file.bin", "b"), "test.bin")};
            let params = {headers: {"Content-Type": "multipart/form-data", "Accept": "application/json"}};
            let request = http.post(url, JSON.stringify(body), params);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

    //TODO: Dima
    group("/files/{id}/link", () => {
        let id = 'TODO_EDIT_THE_ID'; // specify value as there is no example value for this parameter in OpenAPI spec

        // Request No. 1
        {
            let url = BASE_URL + `/files/${id}/link`;
            let request = http.get(url);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

    //TODO: Maks
    group("/system/healthy", () => {

        // Request No. 1
        {
            let url = BASE_URL + `/system/healthy`;
            let request = http.get(url);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

    //TODO: Andriy
    group("/files/all", () => {

        // Request No. 1
        {
            let url = BASE_URL + `/files/all`;
            let request = http.get(url);

            check(request, {
                "": (r) => r.status === 200
            });
        }
    });

}
